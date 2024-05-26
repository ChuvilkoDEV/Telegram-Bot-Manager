import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import '../css/AddTask.css';

const reactionsList = [
  { id: 'like', emoji: '👍' },
  { id: 'fire', emoji: '🔥' },
  { id: 'love', emoji: '🥰' },
  { id: 'clap', emoji: '👏' },
  { id: 'party', emoji: '🎉' },
  { id: 'star', emoji: '🤩' },
  { id: 'hundred', emoji: '💯' },
  { id: 'lightning', emoji: '⚡' },
  { id: 'trophy', emoji: '🏆' },
  { id: 'devil', emoji: '😈' },
  { id: 'cool', emoji: '🆒' },
];

const AddTask = () => {
  const [taskType, setTaskType] = useState('');
  const [taskAuto, setTaskAuto] = useState(false);
  const [taskTarget, setTaskTarget] = useState('');
  const [group, setGroup] = useState('all');
  const [taskCountActions, setTaskCountActions] = useState(500);
  const [taskTimeOut, setTaskTimeOut] = useState(1);
  const [countActionPerTimeout, setCountActionPerTimeout] = useState(500);
  const [percentWave, setPercentWave] = useState(0);
  const [percentMarkupSpread, setPercentMarkupSpread] = useState(0);
  const [taskChannelId, setTaskChannelId] = useState('');
  const [taskReactions, setTaskReactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showReactionsList, setShowReactionsList] = useState(false);

  const handleAddTaskSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    const token = Cookies.get('token');

    const data = {
      token,
      task_type: taskType,
      task_target: taskTarget,
      task_count_actions: taskCountActions,
      task_obj: taskReactions,
      task_time_out: taskTimeOut,
      task_channel_id: taskAuto ? taskChannelId : '',
      task_auto: taskAuto,
      count_action_per_timeout: countActionPerTimeout,
      percetn_wave: percentWave,
      percent_markup_spread: percentMarkupSpread,
      group,
    };

    try {
      const response = await axios.post('http://147.45.111.226:8000/api/addTask', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(response.data);
      alert('Task added successfully');
    } catch (error) {
      console.error('Error adding task:', error);
      alert('Failed to add task.');
    } finally {
      setLoading(false);
    }
  };

  const handleTaskTypeChange = (e) => {
    setTaskType(e.target.value);
    if (e.target.value === 'Подписки') {
      setTaskAuto(false);
    }
  };

  const handleReactionsChange = (reactionId) => {
    setTaskReactions((prevReactions) =>
      prevReactions.includes(reactionId)
        ? prevReactions.filter((id) => id !== reactionId)
        : [...prevReactions, reactionId]
    );
  };

  const handleSelectAllReactions = () => {
    setTaskReactions(reactionsList.map((reaction) => reaction.id));
  };

  return (
    <div className="content">
      <div className="form-container">
        <div className="form-section">
          <h2>Add Task</h2>
          <form onSubmit={handleAddTaskSubmit}>
            <div className="form-group">
              <label>Type</label>
              <select
                value={taskType}
                onChange={handleTaskTypeChange}
                className="form-control"
              >
                <option value="">Select Type</option>
                <option value="Реакции">Reactions</option>
                <option value="Подписки">Subscriptions</option>
                <option value="Просмотры">Views</option>
              </select>
            </div>
            {taskType === 'Реакции' && (
              <div className="form-group">
                <label>Reactions</label>
                <div
                  className="reactions-field"
                  onClick={() => setShowReactionsList(!showReactionsList)}
                >
                  {taskReactions.length > 0
                    ? taskReactions.map((reactionId) =>
                      reactionsList.find((reaction) => reaction.id === reactionId).emoji
                    ).join(' ')
                    : 'Select Reactions'}
                </div>
                {showReactionsList && (
                  <div className="reactions-popup">
                    {reactionsList.map((reaction) => (
                      <div key={reaction.id} className="reaction-item">
                        <input
                          type="checkbox"
                          id={reaction.id}
                          checked={taskReactions.includes(reaction.id)}
                          onChange={() => handleReactionsChange(reaction.id)}
                        />
                        <label htmlFor={reaction.id}>{reaction.emoji}</label>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={handleSelectAllReactions}
                      className="btn btn-secondary"
                    >
                      Select All
                    </button>
                  </div>
                )}
              </div>
            )}
            {taskType !== 'Подписки' && (
              <div className="form-group-checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={taskAuto}
                    onChange={(e) => setTaskAuto(e.target.checked)}
                    className="form-control-checkbox"
                  />
                  Auto
                </label>
                {taskAuto && (
                  <input
                    type="text"
                    value={taskChannelId}
                    onChange={(e) => setTaskChannelId(e.target.value)}
                    className="form-control channel-id-input"
                    placeholder="Channel ID"
                  />
                )}
              </div>
            )}
            <div className="form-group">
              <label>Target</label>
              <input
                type="text"
                value={taskTarget}
                onChange={(e) => setTaskTarget(e.target.value)}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>Group</label>
              <input
                type="text"
                value={group}
                onChange={(e) => setGroup(e.target.value)}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>Action Count</label>
              <input
                type="number"
                min="1"
                max="3635"
                value={taskCountActions}
                onChange={(e) => setTaskCountActions(e.target.value)}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>Time Out</label>
              <input
                type="number"
                value={taskTimeOut}
                onChange={(e) => setTaskTimeOut(e.target.value)}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>Count per Timeout</label>
              <input
                type="number"
                value={countActionPerTimeout}
                onChange={(e) => setCountActionPerTimeout(e.target.value)}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>Wave %</label>
              <input
                type="number"
                value={percentWave}
                onChange={(e) => setPercentWave(e.target.value)}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>Markup Spread %</label>
              <input
                type="number"
                value={percentMarkupSpread}
                onChange={(e) => setPercentMarkupSpread(e.target.value)}
                className="form-control"
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddTask;
