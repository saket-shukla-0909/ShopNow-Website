class APIFilters{
    constructor(query, queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }
    search(){
        const keyword = this.queryStr.keyword ? {
            name: {
                $regex: this.queryStr.keyword,
                $options: 'i',
            }
        }:{};

        this.query = this.query.find({...keyword });
        return this;
    }

    filters(){
        const queryCopy = { ...this.queryStr};

        // Fields to remove
        const fieldsToRemove = ['keyword', 'page'];
        fieldsToRemove.forEach((el)=>{
            delete queryCopy[el];
        })

         // Advance filters for price, ratings etc
        console.log("================================");
        console.log(queryCopy);
        console.log("================================");

        let queryStr = JSON.stringify(queryCopy);
        queryCopy = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match)=>`$${match}`);

        this.query = this.query.find(JSON.parse(queryStr));
        return this
    }

    pagination(resPerpage){
        const currentPage = Number(this.query.Str.page)|| 1;
        const skip = resPerpage * (currentPage1 - 1);

        this.query = this.query.limit(resperPage).skip(skip);
        return this;
    }
}

export default APIFilters;