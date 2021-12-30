export interface CommentConfig {
    url: string;
    allowImg?: boolean;
    allowAt?: boolean;
    imgMaxCount: number;
    commentKey: string;
    target: any;
}
export interface CommentItemData {
    data: CommentItemConfig;
}
export interface CommentItemConfig {
    avatar: string;
    createPerson: string;
    createTime: string;
    content: string;
}
