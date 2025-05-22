import { v4 as uuidv4 } from 'uuid'
import { Card, Carousel, Col, Image, Row } from 'antd'
import { useResponsiveSize } from '../../hook/useResponsiveSize.js'
import { memo } from 'react'
import { useNavigate } from 'react-router-dom'

const CategoryCarousel = ({ pages }) => {
    const size = useResponsiveSize()
    const navigate = useNavigate()

    return (
        <Carousel
            arrows
            style={{
                padding: '0 48px',
                width: '100%',
            }}
            autoplay
            infinite
        >
            {pages?.map((page) => (
                <div key={uuidv4()}>
                    <Row
                        gutter={[8, 8]}
                        style={{ padding: '8px 0' }}
                        justify={'center'}
                        align={'middle'}
                    >
                        {page.map((item) => (
                            <Col
                                key={item.id}
                                xs={12}
                                sm={12}
                                md={8}
                                lg={6}
                                xl={3}
                            >
                                <Card
                                    hoverable
                                    style={{
                                        width: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        height: '100%',
                                        border: 'none',
                                    }}
                                    onClick={() =>
                                        navigate('/search', { state: item.id })
                                    }
                                >
                                    <Image
                                        width={'100%'}
                                        height={120}
                                        src={`${import.meta.env.VITE_BACKEND_URL}${item?.imageUrl}`}
                                        preview={false}
                                        style={{
                                            borderRadius: 8,
                                            objectFit: 'cover',
                                        }}
                                    />
                                    <div
                                        style={{
                                            fontSize: size.subtext2,
                                            fontWeight: 500,
                                            textAlign: 'center',
                                        }}
                                    >
                                        {item?.name}
                                    </div>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>
            ))}
        </Carousel>
    )
}

export default memo(CategoryCarousel)
