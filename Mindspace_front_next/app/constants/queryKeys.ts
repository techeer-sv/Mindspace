export const USER_QUERIES = {
  NICKNAME: "USER_NICKNAME",
};

export const NODE_QUERIES = {
  LIST: "NODE_LIST",
};

export const BOARD_QUERIES = {
  USER_BOARD: (nodeId: number) => ["USER_BOARD", nodeId],
  ALL_BOARD: (nodeId: number) => ["ALL_BOARD", nodeId],
  SINGLE_BOARD: (boardId: number) => ["SINGLE_BOARD", boardId],
};

export const NOTIFICATION_QUERIES = {
  ALL_NOTIFICATION: "ALL_NOTIFICATION",
};

export const COMMENT_QUERIES = {
  BOARD_COMMENT: (boardId: number | undefined) => ["BOARD_COMMENT", boardId],
}

/** // TODO - 추가로 각 쿼리키는 아래처럼 도메인단위로 분리하고 사용할 것
 *
 * // key와 queryFunction을 명확하게 연결해주고,
 * queryFunction이 return하는 데이터가 명확하니
 *  특정 key를 넣었을 때 react query가 리턴해주는 데이터는 typeScript의 관점에서 명확
 * 
 * (https://www.hojunin.com/react-query)
 * 
 * const userKeys = {
  NICKNAME: 'USER_NICKNAME',
  PROFILE: 'USER_PROFILE',

  // 추가적으로 파라미터가 필요한 경우 함수 형태로도 추가 가능
  DETAIL: (id: number) => `USER_DETAIL_${id}`,
}
 */
