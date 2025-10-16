export function getChatRoomId(user1Id, user2Id) {
    if (!user1Id || !user2Id) {
        console.warn("One of the UIDs is undefined", { user1Id, user2Id });
        return null;
    }
    return user1Id < user2Id
        ? `${user1Id}_${user2Id}`
        : `${user2Id}_${user1Id}`;
}