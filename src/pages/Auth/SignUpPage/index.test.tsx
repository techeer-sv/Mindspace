import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SignUpPage from '.';
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
  rest.post('http://test/api/v1/user/signup', (req, res, ctx) => {
    const { email, nickname } = req.body as {
      email: string;
      nickname: string;
    };

    if (nickname === 'duplicateNickname') {
      return res(ctx.status(400), ctx.json({ errorCode: 'U003' }));
    }

    if (email === 'duplicateEmail@test.com') {
      return res(ctx.status(400), ctx.json({ errorCode: 'U004' }));
    }

    return res(ctx.status(200), ctx.json({ message: '회원가입 성공' }));
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('<SignUpPage />', () => {
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
            <SignUpPage />
          </QueryClientProvider>
        </RecoilRoot>
      </BrowserRouter>,
    );
  });

  test('컴포넌트가 처음 렌더링될 때 각 필드가 비어있는지 확인', () => {
    expect(screen.getByPlaceholderText('Email')).toHaveValue('');
    expect(screen.getByPlaceholderText('Nickname')).toHaveValue('');
    expect(screen.getByPlaceholderText('Password')).toHaveValue('');
    expect(screen.getByPlaceholderText('Password Check')).toHaveValue('');
  });

  test('각 필드에 입력값을 제공하면 상태가 제대로 변경되는지 확인', () => {
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

  test('각 필드가 비어 있거나 비밀번호가 일치하지 않는 경우 에러 메시지가 표시되는지 확인', async () => {
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

  test('중복된 닉네임에 대한 에러 메세지 출력 확인', async () => {
    fireEvent.change(screen.getByPlaceholderText('Nickname'), {
      target: { value: 'duplicateNickname' },
    });
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@test.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'testPassword' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password Check'), {
      target: { value: 'testPassword' },
    });
    fireEvent.click(screen.getByText('SIGN UP'));

    await waitFor(() => {
      expect(
        screen.getByText('이미 사용중인 닉네임 입니다'),
      ).toBeInTheDocument();
    });
  });

  test('중복된 이메일에 대한 에러 메세지 출력 확인', async () => {
    fireEvent.change(screen.getByPlaceholderText('Nickname'), {
      target: { value: 'testNickname' },
    });
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'duplicateEmail@test.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'testPassword' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password Check'), {
      target: { value: 'testPassword' },
    });
    fireEvent.click(screen.getByText('SIGN UP'));

    await waitFor(() => {
      expect(
        screen.getByText('이미 사용중인 이메일 입니다'),
      ).toBeInTheDocument();
    });
  });

  test('회원가입 정상 처리에 대한 페이지 이동 확인', async () => {
    fireEvent.change(screen.getByPlaceholderText('Nickname'), {
      target: { value: 'testNickname' },
    });
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@test.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'testPassword' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password Check'), {
      target: { value: 'testPassword' },
    });
    fireEvent.click(screen.getByText('SIGN UP'));

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith('/signin');
    });
  });
});
