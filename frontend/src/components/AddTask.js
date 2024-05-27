import React, { useState, useEffect } from 'react';
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

const taskTypeOptions = {
  'view': 'Просмотры',
  'react': 'Реакции',
  'subs': 'Подписки'
};

const AddTask = ({ sessions = [] }) => {
  // Состояния для хранения данных формы
  const [taskData, setTaskData] = useState({
    taskType: '',
    taskAuto: false,
    taskTarget: '',
    group: '',
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
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);
  const [uniqueGroups, setUniqueGroups] = useState([]);

  // Получение уникальных групп из sessions
  useEffect(() => {
    console.log(sessions)
    if (sessions && sessions.length > 0) {
      const groups = Array.from(new Set(sessions.map(session => session.group)));
      setUniqueGroups(groups);
    }
  }, [sessions]);

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
    if (taskData.taskType === 'subs' && !taskData.taskChannelId) {
      setMessage('ID канала обязателен для подписок');
      setIsError(true);
      return;
    }
    setLoading(true);
    const token = Cookies.get('token');

    // Преобразование данных перед отправкой на сервер
    const transformedData = transformData(taskData);

    // Данные для отправки на сервер
    const data = {
      token,
      task_type: transformedData.taskType,
      task_target: transformedData.taskTarget,
      task_count_actions: transformedData.taskCountActions,
      task_obj: transformedData.taskReactions,
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
      if (response.data.status === 'fail') 
        throw new Error(response.data.message)
      setMessage('Задание успешно добавлено');
      setIsError(false);
    } catch (error) {
      console.error('Ошибка при добавлении задания:', error);
      setMessage('Не удалось добавить задание.');
      setIsError(true);
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
      taskChannelId: value === 'subs' ? prevData.taskChannelId : '',
      taskAuto: value === 'react' || value === 'view' ? prevData.taskAuto : false,
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
      <label>Реакции</label>
      <div
        className="add-task-reactions-field"
        onClick={() => setShowReactionsList(!showReactionsList)}
      >
        {taskData.taskReactions.length > 0
          ? taskData.taskReactions.join(' ')
          : 'Выберите реакции'}
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
            {taskData.taskReactions.length === reactionsList.length ? 'Отменить выбор всех' : 'Выбрать все'}
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="content">
      <div className="add-task-form-container">
        <div className="add-task-form-section">
          <h2>Добавить задание</h2>
          <form onSubmit={handleAddTaskSubmit}>
            <div className="add-task-form-group">
              <label>Тип</label>
              <select
                name="taskType"
                value={taskData.taskType}
                onChange={handleTaskTypeChange}
                className="add-task-form-control"
              >
                <option value="">Выберите тип</option>
                <option value="react">Реакции</option>
                <option value="subs">Подписки</option>
                <option value="view">Просмотры</option>
              </select>
            </div>
            {taskData.taskType === 'react' && renderReactionsField()}
            {(taskData.taskType === 'react' || taskData.taskType === 'view') && (
              <div className="add-task-form-group-checkbox">
                <label>
                  <input
                    type="checkbox"
                    name="taskAuto"
                    checked={taskData.taskAuto}
                    onChange={handleChange}
                    className="add-task-form-control-checkbox"
                  />
                  Автоматическое задание
                </label>
              </div>
            )}
            {renderInput('ID канала', 'taskChannelId', 'text', {
              required: taskData.taskType === 'subs',
              disabled: !(taskData.taskType === 'subs' || (taskData.taskType !== 'subs' && taskData.taskAuto)),
            })}
            {renderInput('Цель', 'taskTarget')}
            <div className="add-task-form-group">
              <label>Группа</label>
              <select
                name="group"
                value={taskData.group}
                onChange={handleChange}
                className="add-task-form-control"
              >
                <option value="">Выберите группу</option>
                {uniqueGroups.map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </select>
            </div>
            {renderInput('Количество действий', 'taskCountActions', 'number', { min: 1, max: 3635 })}
            {renderInput('Тайм-аут', 'taskTimeOut', 'number')}
            {renderInput('Количество на тайм-аут', 'countActionPerTimeout', 'number')}
            {renderInput('Волна %', 'percentWave', 'number')}
            {renderInput('Маржа %', 'percentMarkupSpread', 'number')}
            <button type="submit" className="add-task-btn add-task-btn-primary" disabled={loading}>
              {loading ? 'Отправка...' : 'Отправить'}
            </button>
            {message && (
              <div className={`add-task-message ${isError ? 'add-task-error' : 'add-task-success'}`}>
                {message}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddTask;
