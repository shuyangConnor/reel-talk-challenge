const axios = require('axios')
const catchAsync = require('../utils/catchAsync')

exports.getMovies = catchAsync(async (req, res, next) => {
  // Database API can only return 20 results each request. Send 5 fetching requests simultaneously.
  const requests = []
  for (let i = req.query.page * 5 - 4; i <= req.query.page * 5; i++) {
    requests.push(
      axios({
        method: 'GET',
        url: `https://api.themoviedb.org/3/discover/movie?page=${i}`,
        headers: {
          accept: 'application/json',
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzZDQyZTc0NDgwZjhkYzZkM2RiNDhhYmYxMTkxNTE3NCIsInN1YiI6IjY0MzM1Mzc3OWE2NDM1MDZhYjc5MDYwNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.OxbeuIwkdIGgr3ASzdokoy2YuTcZUys2cpoLwoNbVdk',
        },
      })
    )
  }

  // Wait until all five request get a response.
  const response = await Promise.all(requests)

  // Combine all the movies in 5 requests into one array.
  const results = response.reduce((acc, cur) => {
    return [...acc, ...cur.data.results]
  }, [])

  // Sends back the page number, as well as the list containing 100 movies.
  res.status(200).json({
    status: 'success',
    page: req.query.page,
    length: results.length,
    data: {
      movies: results,
    },
  })
})
