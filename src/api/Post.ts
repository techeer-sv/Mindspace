import makeAxios from 'utils/baseAxios';
import axios from 'axios';

interface PostData {
  id: number;
  title: string;
  content: string;
}

export const getPost = async (id: number): Promise<PostData> => {
  const res = await makeAxios.get(`boards/${id}`);
  const data = res.data;
  console.log('id:', id, '값에 대한 글 정보 api 요청');
  return data;
};

export const deletePost = async (id: number): Promise<void> => {
  await makeAxios.delete(`boards/${id}`);
  console.log('id:', id, '글쓰기 삭제 api 요청');
};

export const createPost = async (
  id: number,
  title: string,
  content: string,
): Promise<void> => {
  await makeAxios.post('boards', {
    nodeId: id,
    title: title,
    content: content,
  });
  console.log('id:', id, '글쓰기 api 요청');
  console.log('title : ', title, '\n content:', content);
};

export const updatePost = async (
  id: number,
  title: string,
  content: string,
): Promise<void> => {
  await makeAxios.put(`boards/${id}`, {
    nodeId: id,
    title: title,
    content: content,
  });
  console.log('id:', id, '글수정 api 요청');
  console.log('title : ', title, '\n content:', content);
};

interface PostListData {
  data: Array<[]>;
}

interface ViewPostData {
  id: number;
  name: string;
  title: string;
  content: string;
  date: string;
  time: string;
}

export const getPostListData = async (): Promise<PostListData> => {
  const res = await axios.get('../dummy/postList.json');
  const data = res.data;
  return data;
};

export const getPostData = async (): Promise<ViewPostData> => {
  const res = await axios.get('../dummy/post.json');
  const data = res.data;

  return data;
};
