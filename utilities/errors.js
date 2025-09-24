exports.APIError= class APIError extends Error{
    constructor(statusCode,msg){
        super(msg)
        this.status=statusCode
    }
}

