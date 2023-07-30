import axios from '@/utils/baseAxios';

/** 본인이 작성한 글 확인 */
export const getPost = async (id: number) => {
  const res = await axios.get('boards', {
    params: {
      node_id: id,
    },
  });
  const data = res.data;
  return data;
};

interface DeletePostParams {
  id: number;
}

export const deletePost = async ({ id }: DeletePostParams) => {
  await axios.delete('boards', {
    params: {
      node_id: id,
    },
  });
};

interface PostParams {
  id: number;
  title: string;
  content: string;
}

export const createPost = async ({ id, title, content }: PostParams) => {
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
};

export const updatePost = async ({ id, title, content }: PostParams) => {
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
};

export const getPostListData = async (id: number) => {
  const res = await axios.get('boards/all', {
    params: {
      node_id: id,
    },
  });
  const data = res.data;
  return data;
};

/** 글 목록 중 하나 확인 */
export const getPostData = async (id: number) => {
  if (id !== null) {
    const res = await axios.get(`boards/${id}`);
    const data = res.data;
    return data;
  } else {
    return;
  }
};
