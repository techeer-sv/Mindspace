import React, { useCallback } from "react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { AgGridReact } from "ag-grid-react";
import {
  CellClickedEvent,
  GridReadyEvent,
  IGetRowsParams,
} from "ag-grid-community";
import { useRecoilValue } from "recoil";
import { ModalWidthAtom, ModalHeightAtom } from "@/recoil/state/resizeAtom";
import { nodeAtom } from "@/recoil/state/nodeAtom";
import { getBoardListData } from "@/api/board";
import { formatDateTime, DateTimeFormat } from "@/utils/dateTime";
import { BoardResponseDto } from "@/constants/types";
interface BoardTableProps {
  onClickedId: (id: number) => void;
}

const NEXT_PAGE_EXISTS = -1;
const MAX_POSTS_PER_LOAD = 10;

function BoardTable({ onClickedId }: BoardTableProps) {
  const selectedNodeInfo = useRecoilValue(nodeAtom);

  const formatBoardListData = (dataList: BoardResponseDto[]) => {
    return dataList?.map((data: BoardResponseDto) => ({
      ...data,
      updatedAt: formatDateTime(data.updatedAt, DateTimeFormat.Date),
    }));
  };

  const onRowDataClicked = (params: CellClickedEvent) => {
    onClickedId(params.data.id);
  };

  const columnDefs = [
    { field: "title" },
    { field: "userNickname" },
    { field: "updatedAt" },
  ];

  const modalWidth = useRecoilValue(ModalWidthAtom);
  const modalHeight = useRecoilValue(ModalHeightAtom);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    let afterCursor: string | undefined = undefined;

    const dataSource = {
      rowCount: undefined,
      getRows: async (params: IGetRowsParams) => {
        try {
          const boardListData = await getBoardListData(
            selectedNodeInfo.id,
            afterCursor,
          );

          afterCursor = boardListData.cursor.afterCursor;

          const rowsThisPage = formatBoardListData(boardListData.data);
          let lastRow = NEXT_PAGE_EXISTS;
          if (!afterCursor) {
            lastRow = params.startRow + boardListData.data.length;
          }
          params.successCallback(rowsThisPage, lastRow);
        } catch (error) {
          console.error("Failed to fetch data:", error);
          params.failCallback();
        }
      },
    };

    params.api.setDatasource(dataSource);
  }, []);

  return (
    <div
      className="ag-theme-alpine"
      style={{
        width: modalWidth - 70,
        height: modalHeight - 70,
        margin: "auto auto",
        borderRadius: "10px",
        overflow: "hidden",
      }}
    >
      <AgGridReact
        rowBuffer={0}
        rowSelection={"multiple"}
        rowModelType={"infinite"}
        cacheBlockSize={MAX_POSTS_PER_LOAD}
        cacheOverflowSize={2}
        maxConcurrentDatasourceRequests={1}
        infiniteInitialRowCount={MAX_POSTS_PER_LOAD}
        maxBlocksInCache={MAX_POSTS_PER_LOAD}
        onGridReady={onGridReady}
        columnDefs={columnDefs}
        defaultColDef={{
          sortable: true,
          minWidth: 100,
          width: 300,
          flex: 1,
        }}
        onCellClicked={onRowDataClicked}
      />
    </div>
  );
}

export default BoardTable;
