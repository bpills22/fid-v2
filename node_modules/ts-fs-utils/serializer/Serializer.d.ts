export type Serializer<T> = {
    deserialize: (fullPath: string) => T;
    serialize: (fullPath: string, content: T) => void;
};
