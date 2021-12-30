import './index.less';
export declare const ddUploadImage: (count?: number, stickers?: {}) => Promise<unknown>;
export declare const previewImage: (current: string, urls: string[]) => void;
export declare const chooseContact: (title?: string, options?: {}, corpId?: any) => Promise<any>;
export declare const CommentItem: ({ data }: {
    data: any;
}) => JSX.Element;
declare const GkComments: (props: any) => JSX.Element;
export default GkComments;
