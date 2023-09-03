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

beforeAll(() => {
  server.listen();
  jest.spyOn(console, 'error').mockImplementation(() => {});
});
afterEach(() => server.resetHandlers());
afterAll(() => {
  server.close();
});

describe('SignUpPage 페이지', () => {
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

  it('컴포넌트가 처음 렌더링될 때 각 필드는 비어있어야 한다', () => {
    expect(screen.getByPlaceholderText('Email')).toHaveValue('');
    expect(screen.getByPlaceholderText('Nickname')).toHaveValue('');
    expect(screen.getByPlaceholderText('Password')).toHaveValue('');
    expect(screen.getByPlaceholderText('Password Check')).toHaveValue('');
  });

  it('각 필드에 입력값을 제공하면 상태가 변경되어야 한다', () => {
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

  it('필드가 비어있거나 유효하지 않을때 에러메세지가 출력되어야 한다', async () => {
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

  describe('1. 회원가입 버튼을 눌렀을 때', () => {
    it('1.1 중복된 닉네임을 입력하면 에러 메세지가 출력되어야 한다.', async () => {
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

    it('1.2 중복된 이메일을 입력하면 에러 메세지가 출력되어야 한다.', async () => {
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

    it('1.3 정상적으로 회원가입이 진행되면 signin페이지로 이동해야한다.', async () => {
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
});
