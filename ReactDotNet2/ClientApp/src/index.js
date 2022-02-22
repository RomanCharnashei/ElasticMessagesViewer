import React, { useState, useEffect, useRef, useMemo } from "react";
import ReactDOM from 'react-dom';
import { Card, CardContent, Stack, TextField, Typography, Link, ImageList, ImageListItem, Button, Grid } from '@mui/material';
import Container from '@mui/material/Container';

const takeAmount = 5;

function App() {

    const [pagination, setPagination] = useState({
        take: takeAmount,
        skip: 0
    });

    const [messages, setMessages] = useState([]);

    const [isLoading, setIsLoading] = useState(false);

    const loader = useRef(null);

    const nextOneBtnRef= useRef(null);

    const nextOneRef = useRef(null);

    nextOneRef.current = () => {
        const skip = pagination.skip === 0 ? pagination.take : pagination.skip + takeAmount;

        setSkip(skip);
    };

    const setSkip = (skip) => {
        nextOneBtnRef.current.value = skip;
        setPagination({
            take: takeAmount,
            skip: skip
         });
    }

    const intersectionObserverRef = useRef(
        new IntersectionObserver(entries => {
            const target = entries[0];
            const currentObserver = intersectionObserverRef.current;
    
            if (target.isIntersecting) {
                currentObserver.unobserve(loader.current);
                nextOneRef.current();
            }
        }, {
            root: null,
            rootMargin: '0px',
            threshold: 1.0,
        })
    );

    useEffect(() => {
        const currentObserver = intersectionObserverRef.current;

        currentObserver.observe(loader.current);

        return () => {
            currentObserver.disconnect();
        };
    }, [messages])


    useEffect(() => {
        setIsLoading(true);

        fetch(`http://localhost:5071/api/vkmessages?query=фотограф&skip=${pagination.skip}&take=${pagination.take}`)
            .then(response => response.json())
            .then((resp) => setMessages([...messages, ...resp.messages]))
            .then(() => setIsLoading(false))
            .catch(console.error);

    }, [pagination])

    return (
        <Container fixed>
            <Stack spacing={2}>
                <TextField id="outlined-basic" label="Search" variant="outlined" />                
                {messages.map((peak, i) => (
                    <Card key={i}>
                        <CardContent>                            
                            <Typography color="text.secondary" gutterBottom>
                                Contact name: <Link href={peak.сontactPersonLink} variant="body2" style={{display: 'inline-block'}}>{peak.сontactPersonName}</Link>
                            </Typography>
                            <Typography color="text.secondary" gutterBottom>
                                Author: <Typography sx={{ typography: 'body2' }} style={{display: 'inline'}}>{peak.author}</Typography>
                            </Typography>
                            <Typography color="text.secondary" gutterBottom>
                                Message: <Typography sx={{ typography: 'body2' }} style={{display: 'inline'}}>{peak.message}</Typography>
                            </Typography>
                            <Typography color="text.secondary" gutterBottom>
                                File Path: <Link href={peak.filePath} variant="body2" style={{display: 'inline-block'}}>Doc</Link>
                            </Typography>
                            <ImageList>
                                {peak.attachments.map((attach) => (
                                    <ImageListItem key={attach.link}>
                                        <img
                                            src={`${attach.link}`}
                                            alt={peak.author}
                                            loading="lazy"
                                        />
                                    </ImageListItem>
                                ))}
                            </ImageList>
                        </CardContent>
                    </Card>
                ))}
                <Grid container spacing={2}>
                    <Grid item xs={2}>
                        <TextField
                            inputRef={nextOneBtnRef}
                            variant="outlined" />
                    </Grid>
                    <Grid item xs={10}>
                        <Button sx={{ width: "100%", height: '100%'}} variant="contained" onClick={() => setSkip(parseInt(nextOneBtnRef.current.value))}>Next One</Button>
                    </Grid>
                </Grid>
                <div className="loading" ref={loader} style={{ height: 100, display: "flex", justifyContent: "center", alignItems: "center" }}>
                    {isLoading && <h2>Loading...</h2>}
                </div>            
            </Stack>
        </Container>
    );
}

ReactDOM.render(<App />, document.querySelector('#root'));
