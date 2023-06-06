import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SignUpPage from '.';
import { QueryClient, QueryClientProvider } from 'react-query';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { RecoilRoot } from 'recoil';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

const server = setupServer(
  rest.post('/user/signup', (req, res, ctx) => {
    return res(ctx.json({ message: '회원가입 성공' }));
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('<SignUpPage />', () => {
  const queryClient = new QueryClient();

  beforeEach(() => {
    render(
      <BrowserRouter>
        <RecoilRoot>
          <QueryClientProvider client={queryClient}>
            <SignUpPage />
          </QueryClientProvider>
        </RecoilRoot>
      </BrowserRouter>,
    );
  });

  it('초기 상태: 컴포넌트가 처음 렌더링될 때 각 필드가 비어있는지 확인', () => {
    expect(screen.getByPlaceholderText('Email')).toHaveValue('');
    expect(screen.getByPlaceholderText('Nickname')).toHaveValue('');
    expect(screen.getByPlaceholderText('Password')).toHaveValue('');
    expect(screen.getByPlaceholderText('Password Check')).toHaveValue('');
  });

  it('입력값 변경: 각 필드에 입력값을 제공하면 상태가 제대로 변경되는지 확인', () => {
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@test.com' },
    });
    expect(screen.getByPlaceholderText('Email')).toHaveValue('test@test.com');

    fireEvent.change(screen.getByPlaceholderText('Nickname'), {
      target: { value: 'testNickname' },
    });
    expect(screen.getByPlaceholderText('Nickname')).toHaveValue('testNickname');

    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'testPassword' },
    });
    expect(screen.getByPlaceholderText('Password')).toHaveValue('testPassword');

    fireEvent.change(screen.getByPlaceholderText('Password Check'), {
      target: { value: 'testPassword' },
    });
    expect(screen.getByPlaceholderText('Password Check')).toHaveValue(
      'testPassword',
    );
  });

  it('유효성 검사: 각 필드가 비어 있거나 비밀번호가 일치하지 않는 경우 에러 메시지가 표시되는지 확인', async () => {
    fireEvent.click(screen.getByText('SIGN UP'));
    expect(screen.getByText('이메일을 입력해 주세요')).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@test.com' },
    });
    fireEvent.click(screen.getByText('SIGN UP'));
    expect(screen.getByText('닉네임을 입력해 주세요')).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText('Nickname'), {
      target: { value: 'testNickname' },
    });
    fireEvent.click(screen.getByText('SIGN UP'));
    expect(screen.getByText('비밀번호를 입력해 주세요')).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'testPassword' },
    });
    fireEvent.click(screen.getByText('SIGN UP'));
    expect(
      screen.getByText('비밀번호 확인을 입력해 주세요'),
    ).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText('Password Check'), {
      target: { value: 'wrongPassword' },
    });
    fireEvent.click(screen.getByText('SIGN UP'));
    expect(
      screen.getByText('재확인 비밀번호가 일치하지 않습니다.'),
    ).toBeInTheDocument();
  });

  it('회원가입 요청: 모든 필드가 유효할 경우 createUser 함수가 호출되는지 확인', async () => {
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@test.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Nickname'), {
      target: { value: 'testNickname' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'testPassword' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password Check'), {
      target: { value: 'testPassword' },
    });
    fireEvent.click(screen.getByText('SIGN UP'));

    await waitFor(() =>
      expect(screen.queryByText('에러가 발생하였습니다 (임시문구)')).toBeNull(),
    );
  });
});
