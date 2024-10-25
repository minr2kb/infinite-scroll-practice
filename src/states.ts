import { atom } from 'jotai';

/**
 * Pagination 한번에 가져올 데이터 수
 */
export const paginationLimitAtom = atom(10);

/**
 * 데이터 가져오는 딜레이(ms)
 */
export const fetchDelayAtom = atom(0);
