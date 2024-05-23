import React from 'react';

function List({ isVisible }) {
  return (
    isVisible ? <div>Список элементов</div> : <div>Список скрыт</div>
  );
}

export default List;
