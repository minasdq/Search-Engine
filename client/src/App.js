import { useState } from "react"
import axios from "axios"
// import { useMutation } from "react-query"

import {
  Button,
  CircularProgress,
  Grid,
  TextField,
  Typography,
} from "@material-ui/core"

import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles({
  input: {
    maxWidth: 450,
    width: "70%",
    marginBottom: "30px",
    marginTop: "30px",
  },
  btn: {
    width: 120,
  },
  results: {
    marginTop: "30px",
  },

  hr: {
    color: "blue",
    backgroundColor: "blue",
    height: 5,
  },
  title: {
    fontSize: 30,
  },
  description: {
    fontSize: 25,
  },
  link: {
    fontSize: 25,
  },
})

const App = () => {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState([])
  const [state, setState] = useState({
    isError: false,
    isLoading: false,
    isSuccess: false,
  })

  const classes = useStyles()

  const searchQuery = async () => {
    if (query) {
      try {
        setState({
          isError: false,
          isLoading: true,
          isSuccess: false,
        })
        const response = await axios.post("/express_backend", null, {
          params: query,
        })
        setResults(response.data)
        console.log(response.data)
        setState({
          isError: false,
          isLoading: false,
          isSuccess: true,
        })
      } catch (e) {
        console.log("error", e)
        setState({
          isError: true,
          isLoading: false,
          isSuccess: false,
        })
      }
    }
  }

  return (
    <Grid item container justifyContent="center">
      <Grid item container justifyContent="center">
        <TextField
          variant="outlined"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className={classes.input}
          placeholder="Search ..."
        />
      </Grid>
      <Button
        variant="contained"
        color="primary"
        className={classes.btn}
        onClick={searchQuery}
      >
        Search
      </Button>
      <Grid item container justifyContent="center" className={classes.results}>
        {state.isLoading ? <CircularProgress /> : null}
        {state.isError ? (
          <Typography variant="h6" color="error">
            An unknown error occurred
          </Typography>
        ) : null}
        <div>
          {state.isSuccess
            ? results.map((result) => (
                <div key={result.link} className={classes.link}>
                  <Typography variant="body1" className={classes.title}>
                    {result.title}
                  </Typography>
                  <a
                    href={result.link}
                    target="_blank"
                    className={classes.link}
                  >
                    {result.displayed_link}
                  </a>
                  <Typography variant="body1" className={classes.description}>
                    {result.snippet}
                  </Typography>
                  <hr />
                </div>
              ))
            : null}
        </div>
      </Grid>
    </Grid>
  )
}

export default App
