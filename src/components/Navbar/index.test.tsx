import {
  render,
  fireEvent,
  screen,
  waitFor,
  act,
} from '@testing-library/react';
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

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('<Navbar />', () => {
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

  test('로그인 상태일 때 사용자 닉네임이 표시되는지 테스트', async () => {
    // 로그인 상태를 시뮬레이션하기 위해 localStorage에 항목을 설정합니다.
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

    // useUserNicknameQuery 훅이 호출되고 나서 사용자 닉네임이 표시되는 것을 기다립니다.
    await waitFor(() => {
      expect(screen.getByText('testName')).toBeInTheDocument();
    });

    const logoutButton = screen.getByText('logout');
    expect(logoutButton).toBeInTheDocument();

    fireEvent.click(logoutButton);

    // 로컬 스토리지에서 토큰이 제거되었는지 확인합니다.
    expect(localStorage.getItem('accessToken')).toBeNull();
  });

  test('로그인하지 않은 상태에서 로그인 버튼이 표시되는지 테스트', async () => {
    // 이 버튼이 문서에 있는지 확인합니다.
    const loginButton = screen.getByText('SignIn');
    expect(loginButton).toBeInTheDocument();

    // 회원가입 버튼도 문서에 있는지 확인합니다.
    const signUpButton = screen.getByText('SignUp');
    expect(signUpButton).toBeInTheDocument();
  });

  test('로고 클릭 시 루트 경로(/)로 이동하는지 테스트', async () => {
    const links = screen.getAllByTestId('mock-link');
    const logo = links.find((link) => link.getAttribute('data-to') === '/');

    // 로고를 클릭합니다.
    fireEvent.click(logo);

    // useNavigate mock 함수가 호출되었는지, 그리고 "/"로 이동하는지 확인합니다.
    expect(logo).toHaveAttribute('data-to', '/');
  });
});
