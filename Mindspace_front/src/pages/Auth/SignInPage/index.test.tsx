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

beforeAll(() => {
  server.listen();
  jest.spyOn(console, 'error').mockImplementation(() => {});
});
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('SignInPage 페이지', () => {
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

  it('컴포넌트가 처음 렌더링될 때 각 필드는 비어있어야 한다.', () => {
    expect(screen.getByPlaceholderText('Email')).toHaveValue('');
    expect(screen.getByPlaceholderText('Password')).toHaveValue('');
  });

  it('각 필드에 입력값을 제공하면 상태가 변경되어야 한다.', () => {
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@test.com' },
    });
    expect(screen.getByPlaceholderText('Email')).toHaveValue('test@test.com');

    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'testPassword' },
    });
    expect(screen.getByPlaceholderText('Password')).toHaveValue('testPassword');
  });

  it('필드가 비어있을때 에러메세지가 출력되어야 한다.', async () => {
    fireEvent.click(screen.getByRole('button', { name: 'SIGN IN' }));
    expect(screen.getByText('이메일을 입력해 주세요')).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@test.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'SIGN IN' }));
    expect(screen.getByText('비밀번호를 입력해 주세요')).toBeInTheDocument();
  });

  describe('1. 로그인 버튼을 눌렀을 때', () => {
    it('존재하지 않는 이메일을 입력했을때 에러메세지가 출력되어야 한다.', async () => {
      fireEvent.change(screen.getByPlaceholderText('Email'), {
        target: { value: 'notExistEmail@test.com' },
      });
      fireEvent.change(screen.getByPlaceholderText('Password'), {
        target: { value: 'testPassword' },
      });

      fireEvent.click(screen.getByRole('button', { name: 'SIGN IN' }));

      await waitFor(() => {
        expect(
          screen.getByText('존재하지 않는 계정입니다'),
        ).toBeInTheDocument();
      });
    });

    it('유효하지 않은 비밀번호를 입력했을때 에러메세지가 출력되어야 한다.', async () => {
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

    it('로그인이 정상적으로 수행되면 로컬스토리지에 accessToken값이 저장되어야 한다.', async () => {
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
  });

  it('회원가입 버튼을 누르면 회원가입 페이지로 이동해야한다.', async () => {
    fireEvent.click(screen.getByRole('button', { name: 'SIGN UP' }));

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith('/signup');
    });
  });
});
