import axios from '@/utils/baseAxios';

interface PostData {
  id: number;
  title: string;
  content: string;
  updatedAt: string;
}

interface UserPostdata {
  id: number;
  title: string;
  content: string;
  updatedAt: string;
  userNickname: string;
}

export const getPost = async (id: number): Promise<PostData> => {
  const res = await axios.get('boards', {
    params: {
      node_id: id,
    },
  });
  const data = res.data;
  console.log('id:', id, '값에 대한 글 정보 api 요청');
  return data;
};

export const deletePost = async (id: number): Promise<void> => {
  await axios.delete('boards', {
    params: {
      node_id: id,
    },
  });
  console.log('id:', id, '글쓰기 삭제 api 요청');
};

export const createPost = async (
  id: number,
  title: string,
  content: string,
): Promise<void> => {
  await axios.post(
    'boards',
    {
      title: title,
      content: content,
    },
    {
      params: {
        node_id: id,
      },
    },
  );
  console.log('id:', id, '글쓰기 api 요청');
  console.log('title : ', title, '\n content:', content);
};

export const updatePost = async (
  id: number,
  title: string,
  content: string,
): Promise<void> => {
  await axios.put(
    'boards',
    {
      title: title,
      content: content,
    },
    {
      params: {
        node_id: id,
      },
    },
  );
  console.log('글수정 api 요청');
  console.log('title : ', title, '\n content:', content);
};

export const getPostListData = async (id: number): Promise<any> => {
  const res = await axios.get('boards/all', {
    params: {
      node_id: id,
    },
  });
  const data = res.data;
  return data;
};

export const getPostData = async (id: number): Promise<UserPostdata> => {
  if (id !== null) {
    const res = await axios.get(`boards/${id}`);
    const data = res.data;
    return data;
  } else {
    return;
  }
};
