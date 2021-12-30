/*
 * @Description: 
 * @Author: tj
 * @Date: 2021-09-22 15:08:45
 * @LastEditTime: 2021-09-22 15:14:37
 * @LastEditors: tj
 */
export interface CommentConfig {
    url: string,
    allowImg?: boolean,
    allowAt?: boolean,
    imgMaxCount: number,
    commentKey: string,
    target: any,
}
export interface CommentItemData {
    //  头像
    data: CommentItemConfig
}
export interface CommentItemConfig {
    //  头像
    avatar: string

    createPerson: string

    createTime: string

    content: string
}