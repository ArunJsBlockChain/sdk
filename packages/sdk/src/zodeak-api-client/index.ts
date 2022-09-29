import { Post } from "./service"

export const getNftCollectionById = async (collectionId:string) => {
    return  await Post({
        url:`collections/getCollectionById`,
        payload:{id:collectionId}
    })
}

export const getNftItemById = async (itemId:string) => {
    return  await Post({
        url:`nft/getItemShortDetailsById`,
        payload:{id:itemId}
    })
}

export const getItemById = async (itemId:string) => {
    return  await Post({
        url:`nft/getItemDetailsById`,
        payload:{id:itemId}
    })
}