export const formateResponse = (response)=>{
    const responseArr = response.split("\n")
    const formatedResponse = responseArr.length===1 ? responseArr[0] : responseArr
    return {
        isPlainMessage: responseArr.length===1,
        reply: formatedResponse
    }
}