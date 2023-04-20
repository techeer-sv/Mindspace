import axios from 'axios';

interface PostData {
  id: number;
  title: string;
  content: string;
}

export const getPost = async (id: number): Promise<PostData> => {
  console.log('id:', id, '값에 대한 글 정보 api 요청');
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Loading 테스트
  const res = await axios.get('../dummy/postData.json');
  const data = res.data;
  return data;
};

export const deletePost = async (id: number): Promise<void> => {
  console.log('id:', id, '글쓰기 삭제 api 요청');
};

export const createPost = async (
  id: number,
  title: string,
  content: string,
): Promise<void> => {
  console.log('id:', id, '글쓰기 더미 api 요청');
  console.log('title : ', title, '\n content:', content);
};

export const updatePost = async (
  id: number,
  title: string,
  content: string,
): Promise<void> => {
  console.log('id:', id, '글수정 api 요청');
  console.log('title : ', title, '\n content:', content);
};
