import { Repository } from "typeorm";
import * as bcrypt from 'bcrypt'

export abstract class BaseService<T> {
    constructor(protected readonly repoditory: Repository<T>) {
    }

    VNTime(n = 0) {
        const now = new Date()
        const time = new Date(Date.UTC(
            now.getUTCFullYear(),
            now.getUTCMonth(),
            now.getUTCDate() + n,
            now.getUTCHours() + 7,
            now.getUTCMinutes(),
            now.getUTCSeconds(),
            now.getUTCMilliseconds()
        ))
        return time
    }

    async hashing(password: string): Promise<string> {
        const salt = await bcrypt.genSalt()
        const hash = await bcrypt.hash(password, salt)
        return hash
    }

    async isMatch(password: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(password, hash)
    }

    async arrayToString(arr: number[]): Promise<string> {
        if (!arr)
            return '0'
        const sortedArray = [...arr].sort((a, b) => a - b)
        return sortedArray.join('-')
    }

    async fixedArrayToString(arr): Promise<string> {
        const result = [];

        for (const subArray of arr) {
            const sortedArray = [...subArray].sort((a, b) => a - b); // Sắp xếp mảng số con
            const subString = sortedArray.join('-'); // Chuyển mảng con thành chuỗi với dấu '-'
            result.push(subString); // Thêm chuỗi con vào kết quả
        }

        const finalString = result.join('/'); // Chuyển mảng kết quả thành chuỗi với dấu '/'
        return finalString;
    }

    async fixedStringToArray(str: string) {
        const segments = str.split('/'); // Cắt chuỗi theo dấu '/'
        const result = [];

        for (const segment of segments) {
            const numberArray = await segment.split('-').map(Number); // Cắt chuỗi con bằng dấu '-' và chuyển đổi thành số
            const sortedArray = [...numberArray].sort((a, b) => a - b); // Sắp xếp mảng số theo thứ tự tăng dần
            result.push(sortedArray); // Thêm mảng đã sắp xếp vào kết quả
        }

        return result;
    }

}