import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Spinner, Alert, Button } from 'react-bootstrap';
import './App.css'

const TopStories = () => {
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const containerStyle = {
        maxWidth: '400px',
        margin: '0 auto' // Center the container
      };

    useEffect(() => {
        const fetchTopStories = async () => {
            try {
                const response = await fetch('http://localhost:8000/top-stories?limit=10');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setStories(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTopStories();
    }, []);

    return (
        <Container className="centered-container">
        <h1 className="my-4 text-center">Top Stories</h1>
        {loading && <div className="d-flex justify-content-center"><Spinner animation="border" /></div>}
        {error && <Alert variant="danger">{error}</Alert>}
        <Row className="justify-content-center">
            {stories.map((story, index) => (
                <Col key={index} xs={12} md={8} lg={6} className="mb-4 border border-secondary">
                    <Card className="border border-primary">
                        <Card.Body>
                            <Card.Title>{story.title}</Card.Title>
                            <Row>
                                <Col xs={6} className="d-flex justify-content-start align-items-center">
                                    <strong>by</strong> {story.author}
                                </Col>
                                <Col xs={6} className="d-flex justify-content-end align-items-center">
                                    {story.time}
                                </Col>
                            </Row>
                            <Button variant="primary" href={story.url} target="_blank" className="mt-3">
                                Read more
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            ))}
        </Row>
    </Container>
    
       
    );
};

export default TopStories;
