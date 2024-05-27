import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import '../css/AddTask.css';

// Список реакций для использования в заданиях
const reactionsList = [
  '👍', '👎', '❤️', '🔥', '🥰', '👏', '😁', '🤔', '🤯', '😱', '🤬', '😢', '🎉', '🤩', '🤮', '💩', '🙏',
  '👌', '🕊', '🤡', '🥱', '🥴', '😍', '🐳', '❤️🔥', '🌚', '🌭', '💯', '🤣', '⚡️', '🍌', '🏆', '💔', '🤨',
  '😐', '🍓', '🍾', '💋', '🖕', '😈', '😴', '😭', '🤓', '👻', '👨💻', '👀', '🎃', '🙈', '😇', '😨', '🤝',
  '✍️', '🤗', '🎅', '🎄', '☃️', '💅', '🤪', '🗿', '🆒', '💘', '🙉', '🦄', '😘', '💊', '🙊', '😎', '👾',
  '🤷♂️', '🤷', '🤷♀️', '😡'
];

const task_type = { 'Просмотры': 'view', 'Реакции': 'react', 'Подписки': 'subs' }

const AddTask = () => {
  // Состояния для хранения данных формы
  const [taskData, setTaskData] = useState({
    taskType: '',
    taskAuto: false,
    taskTarget: '',
    group: 'all',
    taskCountActions: 1,
    taskTimeOut: 1,
    countActionPerTimeout: 1,
    percentWave: 0,
    percentMarkupSpread: 0,
    taskChannelId: '',
    taskReactions: [],
  });
  const [loading, setLoading] = useState(false);
  const [showReactionsList, setShowReactionsList] = useState(false);

  // Обработчик изменения значений в форме
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTaskData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Преобразование числовых полей в числа перед отправкой
  const transformData = (data) => ({
    ...data,
    taskCountActions: Number(data.taskCountActions),
    taskTimeOut: Number(data.taskTimeOut),
    countActionPerTimeout: Number(data.countActionPerTimeout),
    percentWave: Number(data.percentWave),
    percentMarkupSpread: Number(data.percentMarkupSpread),
  });

  // Обработчик отправки формы добавления задания
  const handleAddTaskSubmit = async (e) => {
    e.preventDefault();
    if (taskData.taskType === 'Подписки' && !taskData.taskChannelId) {
      alert('Channel ID is required for Subscriptions');
      return;
    }
    setLoading(true);
    const token = Cookies.get('token');

    // Преобразование данных перед отправкой на сервер
    const transformedData = transformData(taskData);

    // Данные для отправки на сервер
    const data = {
      token,
      task_type: task_type[transformedData.taskType],
      task_target: transformedData.taskTarget,
      task_count_actions: transformedData.taskCountActions,
      task_reactions: transformedData.taskReactions,
      task_time_out: transformedData.taskTimeOut,
      task_channel_id: transformedData.taskChannelId,
      task_auto: transformedData.taskAuto,
      count_action_per_timeout: transformedData.countActionPerTimeout,
      percetn_wave: transformedData.percentWave,
      percent_markup_spread: transformedData.percentMarkupSpread,
      group: transformedData.group,
    };

    try {
      // Отправка данных на сервер
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

  // Обработчик изменения типа задания
  const handleTaskTypeChange = (e) => {
    const { value } = e.target;
    setTaskData((prevData) => ({
      ...prevData,
      taskType: value,
      taskChannelId: value === 'Подписки' ? prevData.taskChannelId : '', // Reset taskChannelId if not "Подписки"
      taskAuto: value === 'Реакции' || value === 'Просмотры' ? prevData.taskAuto : false, // Reset taskAuto if not "Реакции" or "Просмотры"
    }));
  };

  // Обработчик изменения реакций
  const handleReactionsChange = (reaction) => {
    setTaskData((prevData) => ({
      ...prevData,
      taskReactions: prevData.taskReactions.includes(reaction)
        ? prevData.taskReactions.filter((r) => r !== reaction)
        : [...prevData.taskReactions, reaction],
    }));
  };

  // Обработчик выбора/снятия всех реакций
  const handleSelectAllReactions = () => {
    setTaskData((prevData) => ({
      ...prevData,
      taskReactions: prevData.taskReactions.length === reactionsList.length
        ? []
        : reactionsList,
    }));
  };

  // Функция для рендеринга полей ввода
  const renderInput = (label, name, type = 'text', additionalProps = {}) => (
    <div className="add-task-form-group">
      <label>{label}</label>
      <input
        type={type}
        name={name}
        value={taskData[name]}
        onChange={handleChange}
        className="add-task-form-control"
        {...additionalProps}
      />
    </div>
  );

  // Функция для рендеринга поля с реакциями
  const renderReactionsField = () => (
    <div className="add-task-form-group">
      <label>Reactions</label>
      <div
        className="add-task-reactions-field"
        onClick={() => setShowReactionsList(!showReactionsList)}
      >
        {taskData.taskReactions.length > 0
          ? taskData.taskReactions.join(' ')
          : 'Select Reactions'}
      </div>
      {showReactionsList && (
        <div className="add-task-reactions-popup">
          {reactionsList.map((reaction) => (
            <div key={reaction} className="add-task-reaction-item">
              <button
                type="button"
                className="add-task-reaction-button"
                onClick={() => handleReactionsChange(reaction)}
              >
                {reaction}
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleSelectAllReactions}
            className="add-task-btn add-task-btn-secondary"
          >
            {taskData.taskReactions.length === reactionsList.length ? 'Deselect All' : 'Select All'}
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="content">
      <div className="add-task-form-container">
        <div className="add-task-form-section">
          <h2>Add Task</h2>
          <form onSubmit={handleAddTaskSubmit}>
            <div className="add-task-form-group">
              <label>Type</label>
              <select
                name="taskType"
                value={taskData.taskType}
                onChange={handleTaskTypeChange}
                className="add-task-form-control"
              >
                <option value="">Select Type</option>
                <option value="Реакции">Reactions</option>
                <option value="Подписки">Subscriptions</option>
                <option value="Просмотры">Views</option>
              </select>
            </div>
            {taskData.taskType === 'Реакции' && renderReactionsField()}
            {(taskData.taskType === 'Реакции' || taskData.taskType === 'Просмотры') && (
              <div className="add-task-form-group-checkbox">
                <label>
                  <input
                    type="checkbox"
                    name="taskAuto"
                    checked={taskData.taskAuto}
                    onChange={handleChange}
                    className="add-task-form-control-checkbox"
                  />
                  Auto Task
                </label>
              </div>
            )}
            {renderInput('Channel ID', 'taskChannelId', 'text', {
              required: taskData.taskType === 'Подписки',
              disabled: taskData.taskAuto === true || taskData.taskType === 'Подписки',
            })}
            {renderInput('Target', 'taskTarget')}
            {renderInput('Group', 'group')}
            {renderInput('Action Count', 'taskCountActions', 'number', { min: 1, max: 3635 })}
            {renderInput('Time Out', 'taskTimeOut', 'number')}
            {renderInput('Count per Timeout', 'countActionPerTimeout', 'number')}
            {renderInput('Wave %', 'percentWave', 'number')}
            {renderInput('Markup Spread %', 'percentMarkupSpread', 'number')}
            <button type="submit" className="add-task-btn add-task-btn-primary" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddTask;
