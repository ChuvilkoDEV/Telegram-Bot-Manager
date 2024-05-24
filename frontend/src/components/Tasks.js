import React, { useMemo, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useTable, useSortBy, useResizeColumns, useFilters, usePagination } from 'react-table';

export default function Tasks() {
    useEffect(() => {
        const fetchSessions = async () => {
            try {
            const token = Cookies.get('token');
            const response = await axios.post(
                'http://147.45.111.226:8000/api/getAutoTasks',
                { token }
            );
            if (response.data.status !== 'ok')
                throw new Error('Что-то пошло не так...');
            
            console.log(response.data)
            // Cookies.set('AllSessions', response.data.sessions);
            // setSessions(response.data.sessions);
            } catch (err) {
            console.error(err);
            }
        };

        fetchSessions();
        }, []);

    return (
        <div>
        Страница Задач
        </div>
    )
}
