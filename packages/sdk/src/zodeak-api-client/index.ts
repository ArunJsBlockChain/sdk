import { Post } from "./service"

export const getNftCollectionById = async (collectionId:string) => {
    return  await Post({
        url:`collections/getCollectionById`,
        payload:{id:collectionId}
    })
}