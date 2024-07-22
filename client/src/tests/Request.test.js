/* eslint-disable testing-library/no-unnecessary-act */
/* eslint-disable testing-library/prefer-screen-queries */
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { BrowserRouter } from 'react-router-dom';
import Request from '../pages/Request';
import '@testing-library/jest-dom'

describe('Форма заявки', () => {
  jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'), 
    useNavigate: jest.fn(),
  }));
  window.matchMedia = jest.fn(() => ({
    matches: false,
    addListener: jest.fn(),
    removeListener: jest.fn(),
  }));

  it('Все компоненты в форме', async () => {
    const { getByLabelText, getByText } = render(
      <BrowserRouter>
        <Request />
      </BrowserRouter>
    );

    expect(getByText('Назад')).toBeInTheDocument();
    expect(getByLabelText('Название')).toBeInTheDocument();
    expect(getByLabelText('Пол')).toBeInTheDocument();
    expect(getByLabelText('Фамилия')).toBeInTheDocument();
    expect(getByLabelText('Имя')).toBeInTheDocument();
    expect(getByLabelText('Телефон')).toBeInTheDocument();
    expect(getByLabelText('Адрес')).toBeInTheDocument();
    expect(getByLabelText('Срочность')).toBeInTheDocument();
    expect(getByText('Отправить')).toBeInTheDocument();
  });

  it('Ответ на введённые данные верный', async () => {
    const { getByLabelText, getByText } = render(
        <BrowserRouter>
          <Request />
        </BrowserRouter>
      );

    const sexInput = getByLabelText('Пол');
    const surnameInput = getByLabelText('Фамилия');
    const nameInput = getByLabelText('Имя');
    const numberInput = getByLabelText('Телефон');
    const addressInput = getByLabelText('Адрес');
    const extraInput = getByLabelText('Срочность');
    const getButton = getByText('Отправить');

    fireEvent.change(sexInput, { target: { value: '1' } });
    fireEvent.change(surnameInput, { target: { value: 'Ааааааа' } });
    fireEvent.change(nameInput, { target: { value: 'АААААААА' } });
    fireEvent.change(numberInput, { target: { value: '89123123210' } });
    fireEvent.change(addressInput, { target: { value: 'г. Аа, кв. а' } });
    fireEvent.change(extraInput, { target: { value: 'true' } });

    await act(async () => {
      fireEvent.click(getButton);
      await waitFor(() => {
        expect(getByText('Заявка успешно создана.')).toBeInTheDocument();
      }, {timeout: 2000});
    });
  });
});