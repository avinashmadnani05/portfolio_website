import gym
import numpy as np
import torch
import torch.nn as nn
import torch.optim as optim
import random
from collections import deque

# ----- Dummy Drone Simulation Environment -----
class DroneEnv(gym.Env):
    def __init__(self):
        super(DroneEnv, self).__init__()
        # For example, state has 4 continuous values
        self.observation_space = gym.spaces.Box(low=-np.inf, high=np.inf, shape=(4,), dtype=np.float32)
        # Action: 2 continuous control commands (e.g., pitch and roll)
        self.action_space = gym.spaces.Box(low=-1.0, high=1.0, shape=(2,), dtype=np.float32)
        self.reset()

    def reset(self):
        # Start at a random state; goal is the origin (0,0,0,0)
        self.state = np.random.uniform(-1, 1, size=(4,))
        self.goal = np.zeros(4)
        return self.state

    def step(self, action):
        # A simple dynamics: new state = old state + action (padded to 4 dims) + noise
        noise = np.random.normal(0, 0.1, size=(4,))
        # Apply action to first two dimensions only
        self.state = self.state + np.concatenate([action, np.zeros(2)]) + noise
        # Reward is negative distance from goal
        reward = -np.linalg.norm(self.state - self.goal)
        # Episode ends if close enough to goal
        done = np.linalg.norm(self.state - self.goal) < 0.1
        info = {}
        return self.state, reward, done, info

# ----- Replay Buffer -----
class ReplayBuffer:
    def __init__(self, capacity):
        self.buffer = deque(maxlen=capacity)

    def push(self, state, action, reward, next_state, done):
        self.buffer.append((state, action, reward, next_state, done))

    def sample(self, batch_size):
        batch = random.sample(self.buffer, batch_size)
        states, actions, rewards, next_states, dones = map(np.stack, zip(*batch))
        return states, actions, rewards, next_states, dones

    def __len__(self):
        return len(self.buffer)

# ----- Actor Network -----
class Actor(nn.Module):
    def __init__(self, state_dim, action_dim, max_action):
        super(Actor, self).__init__()
        self.l1 = nn.Linear(state_dim, 256)
        self.l2 = nn.Linear(256, 256)
        self.mean = nn.Linear(256, action_dim)
        self.log_std = nn.Linear(256, action_dim)
        self.max_action = max_action

    def forward(self, state):
        x = torch.relu(self.l1(state))
        x = torch.relu(self.l2(x))
        mean = self.mean(x)
        log_std = self.log_std(x)
        # Clamp log_std to avoid numerical issues
        log_std = torch.clamp(log_std, -20, 2)
        std = torch.exp(log_std)
        return mean, std

    def sample(self, state):
        mean, std = self.forward(state)
        normal = torch.distributions.Normal(mean, std)
        # Reparameterization trick
        x_t = normal.rsample()
        y_t = torch.tanh(x_t)
        action = y_t * self.max_action
        log_prob = normal.log_prob(x_t)
        # Correction for Tanh squashing
        log_prob -= torch.log(self.max_action * (1 - y_t.pow(2)) + 1e-6)
        log_prob = log_prob.sum(1, keepdim=True)
        mean = torch.tanh(mean) * self.max_action
        return action, log_prob, mean

# ----- Critic Network (Twin Q-Networks) -----
class Critic(nn.Module):
    def __init__(self, state_dim, action_dim):
        super(Critic, self).__init__()
        # Q1 architecture
        self.l1 = nn.Linear(state_dim + action_dim, 256)
        self.l2 = nn.Linear(256, 256)
        self.l3 = nn.Linear(256, 1)
        # Q2 architecture
        self.l4 = nn.Linear(state_dim + action_dim, 256)
        self.l5 = nn.Linear(256, 256)
        self.l6 = nn.Linear(256, 1)

    def forward(self, state, action):
        sa = torch.cat([state, action], 1)
        q1 = torch.relu(self.l1(sa))
        q1 = torch.relu(self.l2(q1))
        q1 = self.l3(q1)
        q2 = torch.relu(self.l4(sa))
        q2 = torch.relu(self.l5(q2))
        q2 = self.l6(q2)
        return q1, q2

# ----- Soft Actor-Critic (SAC) Agent -----
class SACAgent:
    def __init__(self, state_dim, action_dim, max_action):
        self.actor = Actor(state_dim, action_dim, max_action).to(device)
        self.actor_optimizer = optim.Adam(self.actor.parameters(), lr=3e-4)
        self.critic = Critic(state_dim, action_dim).to(device)
        self.critic_optimizer = optim.Adam(self.critic.parameters(), lr=3e-4)
        self.target_critic = Critic(state_dim, action_dim).to(device)
        self.target_critic.load_state_dict(self.critic.state_dict())
        self.max_action = max_action
        self.discount = 0.99
        self.tau = 0.005
        self.alpha = 0.2  # Entropy temperature

    def select_action(self, state):
        state = torch.FloatTensor(state.reshape(1, -1)).to(device)
        action, _, _ = self.actor.sample(state)
        return action.detach().cpu().numpy()[0]

    def train(self, replay_buffer, batch_size=256):
        # Sample replay buffer
        state, action, reward, next_state, done = replay_buffer.sample(batch_size)
        state = torch.FloatTensor(state).to(device)
        action = torch.FloatTensor(action).to(device)
        reward = torch.FloatTensor(reward).unsqueeze(1).to(device)
        next_state = torch.FloatTensor(next_state).to(device)
        done = torch.FloatTensor(done).unsqueeze(1).to(device)

        # ----- Critic Update -----
        with torch.no_grad():
            next_action, next_log_prob, _ = self.actor.sample(next_state)
            target_q1, target_q2 = self.target_critic(next_state, next_action)
            target_q = torch.min(target_q1, target_q2) - self.alpha * next_log_prob
            target_q = reward + (1 - done) * self.discount * target_q

        current_q1, current_q2 = self.critic(state, action)
        critic_loss = nn.MSELoss()(current_q1, target_q) + nn.MSELoss()(current_q2, target_q)
        self.critic_optimizer.zero_grad()
        critic_loss.backward()
        self.critic_optimizer.step()

        # ----- Actor Update -----
        action_pi, log_pi, _ = self.actor.sample(state)
        q1_pi, q2_pi = self.critic(state, action_pi)
        min_q_pi = torch.min(q1_pi, q2_pi)
        actor_loss = (self.alpha * log_pi - min_q_pi).mean()
        self.actor_optimizer.zero_grad()
        actor_loss.backward()
        self.actor_optimizer.step()

        # ----- Update Target Critic -----
        for param, target_param in zip(self.critic.parameters(), self.target_critic.parameters()):
            target_param.data.copy_(self.tau * param.data + (1 - self.tau) * target_param.data)

# ----- Main Training Loop -----
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

env = DroneEnv()
state_dim = env.observation_space.shape[0]
action_dim = env.action_space.shape[0]
max_action = float(env.action_space.high[0])

agent = SACAgent(state_dim, action_dim, max_action)
replay_buffer = ReplayBuffer(capacity=1000000)

total_timesteps = 10000
start_timesteps = 1000  # Use random actions in the beginning
batch_size = 256

episode_reward = 0
episode_timesteps = 0
episode_num = 0
state = env.reset()

for t in range(total_timesteps):
    episode_timesteps += 1
    # Select action: random before start_timesteps, else according to policy
    if t < start_timesteps:
        action = env.action_space.sample()
    else:
        action = agent.select_action(np.array(state))
    # Step environment
    next_state, reward, done, _ = env.step(action)
    replay_buffer.push(state, action, reward, next_state, float(done))
    state = next_state
    episode_reward += reward

    # Train agent after collecting sufficient data
    if t >= start_timesteps:
        agent.train(replay_buffer, batch_size)

    if done:
        print(f"Total T: {t} Episode Num: {episode_num} Episode T: {episode_timesteps} Reward: {episode_reward:.2f}")
        state = env.reset()
        episode_reward = 0
        episode_timesteps = 0
        episode_num += 1
