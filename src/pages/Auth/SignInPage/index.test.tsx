import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SignInPage from '.';
import { QueryClient, QueryClientProvider } from 'react-query';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { RecoilRoot } from 'recoil';

const navigateMock = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => navigateMock,
}));

const server = setupServer(
  rest.post('http://test/api/v1/user/login', (req, res, ctx) => {
    const { email, password } = req.body as {
      email: string;
      password: string;
    };

    if (email === 'notExistEmail@test.com') {
      return res(ctx.status(400), ctx.json({ errorCode: 'U001' }));
    }

    if (password === 'invalidPassword') {
      return res(ctx.status(400), ctx.json({ errorCode: 'U002' }));
    }

    /**
     * //FIXME
     * id값으로 받아오는 응답값을 향후 백엔드 업데이트에 맞춰 accessToken값으로 수정해야합니다.
     */

    return res(ctx.status(200), ctx.json({ id: 'accessToken' }));
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('<SignInPage />', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  beforeEach(() => {
    render(
      <BrowserRouter>
        <RecoilRoot>
          <QueryClientProvider client={queryClient}>
            <SignInPage />
          </QueryClientProvider>
        </RecoilRoot>
      </BrowserRouter>,
    );
  });

  test('컴포넌트가 처음 이메일, 비밀번호 필드가 비어있는지 확인', () => {
    expect(screen.getByPlaceholderText('Email')).toHaveValue('');
    expect(screen.getByPlaceholderText('Password')).toHaveValue('');
  });

  test('각 필드에 입력값을 제공하면 상태가 제대로 변경되는지 확인', () => {
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@test.com' },
    });
    expect(screen.getByPlaceholderText('Email')).toHaveValue('test@test.com');

    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'testPassword' },
    });
    expect(screen.getByPlaceholderText('Password')).toHaveValue('testPassword');
  });

  test('각 필드가 비어 있거나 비밀번호가 일치하지 않는 경우 에러 메시지가 표시되는지 확인', async () => {
    fireEvent.click(screen.getByRole('button', { name: 'SIGN IN' }));
    expect(screen.getByText('이메일을 입력해 주세요')).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@test.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'SIGN IN' }));
    expect(screen.getByText('비밀번호를 입력해 주세요')).toBeInTheDocument();
  });

  test('존재하지 않는 이메일 입력에 대한 로그인 에러 메세지 출력 확인', async () => {
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'notExistEmail@test.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'testPassword' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'SIGN IN' }));

    await waitFor(() => {
      expect(screen.getByText('존재하지 않는 계정입니다')).toBeInTheDocument();
    });
  });

  test('유효하지 않은 비밀번호 입력에 대한 로그인 에러 메세지 출력 확인', async () => {
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@test.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'invalidPassword' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'SIGN IN' }));

    await waitFor(() => {
      expect(
        screen.getByText('비밀번호를 다시 확인해주세요'),
      ).toBeInTheDocument();
    });
  });

  test('로그인이 정상적으로 수행되었을때 메인페이지 이동과 토큰 저장 기능 확인', async () => {
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@test.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'testPassword' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'SIGN IN' }));

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith('/');
    });

    const storedData = localStorage.getItem('accessToken');
    expect(storedData).toBe('accessToken');
  });

  test('회원가입 버튼을 눌렀을때 회원가입 페이지로 정상적으로 이동하는지 테스트', async () => {
    fireEvent.click(screen.getByRole('button', { name: 'SIGN UP' }));

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith('/signup');
    });
  });
});
