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
  const [taskData, setTaskData] = useState({
    taskType: '',
    taskAuto: false,
    taskTarget: '',
    group: 'all',
    taskCountActions: 500,
    taskTimeOut: 1,
    countActionPerTimeout: 500,
    percentWave: 0,
    percentMarkupSpread: 0,
    taskChannelId: '',
    taskReactions: [],
  });
  const [loading, setLoading] = useState(false);
  const [showReactionsList, setShowReactionsList] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTaskData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAddTaskSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = Cookies.get('token');

    const data = {
      token,
      task_type: taskData.taskType,
      task_target: taskData.taskTarget,
      task_count_actions: taskData.taskCountActions,
      task_obj: taskData.taskReactions,
      task_time_out: taskData.taskTimeOut,
      task_channel_id: taskData.taskAuto ? taskData.taskChannelId : '',
      task_auto: taskData.taskAuto,
      count_action_per_timeout: taskData.countActionPerTimeout,
      percetn_wave: taskData.percentWave,
      percent_markup_spread: taskData.percentMarkupSpread,
      group: taskData.group,
    };

    try {
      const response = await axios.post('http://147.45.111.226:8000/api/addTask', data, {
        headers: { 'Content-Type': 'application/json' },
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
    handleChange(e);
    if (e.target.value === 'Подписки') {
      setTaskData((prevData) => ({ ...prevData, taskAuto: false }));
    }
  };

  const handleReactionsChange = (reactionId) => {
    setTaskData((prevData) => ({
      ...prevData,
      taskReactions: prevData.taskReactions.includes(reactionId)
        ? prevData.taskReactions.filter((id) => id !== reactionId)
        : [...prevData.taskReactions, reactionId],
    }));
  };

  const handleSelectAllReactions = () => {
    setTaskData((prevData) => ({
      ...prevData,
      taskReactions: reactionsList.map((reaction) => reaction.id),
    }));
  };

  const renderInput = (label, name, type = 'text', additionalProps = {}) => (
    <div className="form-group">
      <label>{label}</label>
      <input
        type={type}
        name={name}
        value={taskData[name]}
        onChange={handleChange}
        className="form-control"
        {...additionalProps}
      />
    </div>
  );

  const renderReactionsField = () => (
    <div className="form-group">
      <label>Reactions</label>
      <div
        className="reactions-field"
        onClick={() => setShowReactionsList(!showReactionsList)}
      >
        {taskData.taskReactions.length > 0
          ? taskData.taskReactions
              .map((reactionId) =>
                reactionsList.find((reaction) => reaction.id === reactionId).emoji
              )
              .join(' ')
          : 'Select Reactions'}
      </div>
      {showReactionsList && (
        <div className="reactions-popup">
          {reactionsList.map((reaction) => (
            <div key={reaction.id} className="reaction-item">
              <input
                type="checkbox"
                id={reaction.id}
                checked={taskData.taskReactions.includes(reaction.id)}
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
  );

  return (
    <div className="content">
      <div className="form-container">
        <div className="form-section">
          <h2>Add Task</h2>
          <form onSubmit={handleAddTaskSubmit}>
            <div className="form-group">
              <label>Type</label>
              <select
                name="taskType"
                value={taskData.taskType}
                onChange={handleTaskTypeChange}
                className="form-control"
              >
                <option value="">Select Type</option>
                <option value="Реакции">Reactions</option>
                <option value="Подписки">Subscriptions</option>
                <option value="Просмотры">Views</option>
              </select>
            </div>
            {taskData.taskType === 'Реакции' && renderReactionsField()}
            {taskData.taskType !== 'Подписки' && (
              <div className="form-group-checkbox">
                <label>
                  <input
                    type="checkbox"
                    name="taskAuto"
                    checked={taskData.taskAuto}
                    onChange={handleChange}
                    className="form-control-checkbox"
                  />
                  Auto
                </label>
                {taskData.taskAuto && renderInput('Channel ID', 'taskChannelId')}
              </div>
            )}
            {renderInput('Target', 'taskTarget')}
            {renderInput('Group', 'group')}
            {renderInput('Action Count', 'taskCountActions', 'number', { min: 1, max: 3635 })}
            {renderInput('Time Out', 'taskTimeOut', 'number')}
            {renderInput('Count per Timeout', 'countActionPerTimeout', 'number')}
            {renderInput('Wave %', 'percentWave', 'number')}
            {renderInput('Markup Spread %', 'percentMarkupSpread', 'number')}
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
