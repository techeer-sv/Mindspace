import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '.';
import { QueryClient, QueryClientProvider } from 'react-query';

import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { RecoilRoot } from 'recoil';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Link: ({ to, children }: any) => (
    <div data-testid="mock-link" data-to={to}>
      {children}
    </div>
  ),
}));

const server = setupServer(
  rest.get('http://test/api/v1/user/nickname', (_, res, ctx) => {
    return res(ctx.status(200), ctx.json({ nickname: 'testName' }));
  }),
);

beforeAll(() => {
  server.listen();
  jest.spyOn(console, 'error').mockImplementation(() => {});
});
afterEach(() => server.resetHandlers());
afterAll(() => {
  server.close();
});

describe('Navbar 컴포넌트', () => {
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
            <Navbar />
          </QueryClientProvider>
        </RecoilRoot>
      </BrowserRouter>,
    );
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('1. 로그인 상태일 때', () => {
    beforeEach(() => {
      localStorage.setItem('accessToken', 'testToken');

      render(
        <BrowserRouter>
          <RecoilRoot>
            <QueryClientProvider client={queryClient}>
              <Navbar />
            </QueryClientProvider>
          </RecoilRoot>
        </BrowserRouter>,
      );
    });

    it('1.1 사용자 닉네임을 화면에 표시한다.', async () => {
      await waitFor(() => {
        expect(screen.getByText('testName')).toBeInTheDocument();
      });
    });

    it('1.2 로그아웃 버튼을 화면에 표시한다.', () => {
      const logoutButton = screen.getByText('logout');
      expect(logoutButton).toBeInTheDocument();
    });

    it('1.3 로그아웃 버튼을 클릭하면 스토리지값을 초기화한다.', () => {
      const logoutButton = screen.getByText('logout');
      fireEvent.click(logoutButton);
      expect(localStorage.getItem('accessToken')).toBeNull();
    });
  });

  describe('2. 로그인 상태가 아닐 때', () => {
    it('2.1 회원가입과 로그인 버튼을 화면에 표현한다.', async () => {
      const loginButton = screen.getByText('SignIn');
      expect(loginButton).toBeInTheDocument();

      const signUpButton = screen.getByText('SignUp');
      expect(signUpButton).toBeInTheDocument();
    });
  });

  it('로고 클릭 시 루트 경로(/)로 이동한다.', async () => {
    const links = screen.getAllByTestId('mock-link');
    const logo = links.find((link) => link.getAttribute('data-to') === '/');

    fireEvent.click(logo);

    expect(logo).toHaveAttribute('data-to', '/');
  });
});
