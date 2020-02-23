import React, { Component } from 'react';
import {
    View,
    SafeAreaView,
    Text,
    StyleSheet,
    Image,
    Dimensions,
    TouchableOpacity,
    UIManager,
    LayoutAnimation,
    ScrollView,
    StatusBar,
    ActivityIndicator,
    FlatList,
    ImageBackground
} from 'react-native';
import { getStatusBarHeight } from 'react-native-iphone-x-helper'
import LinearGradient from 'react-native-linear-gradient';
import { CollapsibleHeaderScrollView } from 'react-native-collapsible-header-views';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';

const { width, height } = Dimensions.get("window")

const API_KEY = 'ab7e70767dfe42f8f72cd8b9e592a44c'
const IMAGE_REQUEST = 'https://image.tmdb.org/t/p/w500'
const UpComing = 'Upcoming'
const Popular = 'Popular'
const TopRated = 'TopRated'

const movieBannerWidth = width / 2 - width * 0.05 - 8
const movieBannerHeight = (width / 2 - 16) * 1.6



export default class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            moviesListOption: UpComing,
            upComingMovies: [],
            upComingPaginationPage: 1,
            popularMovies: [],
            popularMoviesPaginationPage: 1,
            topRatedMovies: [],
            topRatedPaginationPage: 1,
            paginatedScrollLoading: false,
            loading: false
        };
    }

    UNSAFE_componentWillMount = () => {
        if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
    }

    componentDidMount = () => {
        this.loadUpcomingMovies()
        this.loadPopularMovies()
        this.loadTopratedMovies()
    }

    loadUpcomingMovies = () => {
        const { upComingMovies, upComingPaginationPage } = this.state;
        this.setState({ loading: true })
        fetch(`https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}&language=pt-BR&&include_image_language=pt-BR&page=${upComingPaginationPage}`)
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    upComingMovies: upComingPaginationPage == 1 ?
                        responseJson.results :
                        [...upComingMovies, ...responseJson.results],
                }, () => {
                    this.setState({
                        upComingPaginationPage: upComingPaginationPage + 1,
                        loading: false
                    })
                })

            })
            .catch((error) => {
                console.error(error);
            });
    }

    loadPopularMovies = () => {
        const { popularMovies, popularMoviesPaginationPage } = this.state;
        this.setState({ loading: true })
        fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=pt-BR&&include_image_language=pt-BR&page=${popularMoviesPaginationPage}`)
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    popularMovies: popularMoviesPaginationPage == 1 ?
                        responseJson.results :
                        [...popularMovies, ...responseJson.results],
                }, () => {
                    this.setState({
                        popularMoviesPaginationPage: popularMoviesPaginationPage + 1,
                        loading: false
                    })
                })

            })
            .catch((error) => {
                console.error(error);
            });
    }

    loadTopratedMovies = () => {
        const { topRatedMovies, topRatedPaginationPage } = this.state;
        this.setState({ loading: true })
        fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=pt-BR&&include_image_language=pt-BR&page=${topRatedPaginationPage}`)
            .then((response) => response.json())
            .then((responseJson) => {

                this.setState({
                    topRatedMovies: topRatedPaginationPage == 1 ?
                        responseJson.results :
                        [...topRatedMovies, ...responseJson.results],
                }, () => {
                    this.setState({
                        topRatedPaginationPage: topRatedPaginationPage + 1,
                        loading: false
                    })
                })

            })
            .catch((error) => {
                console.error(error);
            });
    }

    renderMovieBanner = (movie, index, movieList) => {
        return (
            <View style={styles.movieItemContainer}>
                <TouchableOpacity
                    style={styles.movieImage}
                >
                    {!movie.hasLoadedImage && <ShimmerPlaceHolder
                        style={styles.movieImageSkeletonPlaceholder}
                        autoRun
                    />}
                    <ImageBackground
                        style={[styles.movieImage, movie.hasLoadedImage ? { opacity: 1 } : { opacity: 0 }, { position: 'absolute', left: 0, top: 0 }]}
                        source={{ uri: IMAGE_REQUEST + movie.poster_path }}
                        onLoad={() => { this.onImageLoadEnd(index, movieList) }}
                        imageStyle={{ borderRadius: 10 }}
                    >
                        <LinearGradient
                            style={styles.movieBannerGradient}
                            colors={['transparent', 'rgba(0,0,0,0.48)']}
                        />
                        <Text numberOfLines={4} style={styles.movieTitle}>{movie.title}</Text>
                    </ImageBackground>
                </TouchableOpacity>
            </View>
        )
    }

    onImageLoadEnd = (index, movieList) => {
        var movies;
        switch (movieList) {
            case UpComing:
                movies = this.state.upComingMovies;
                break;
            case Popular:
                movies = this.state.popularMovies;
                break;
            case TopRated:
                movies = this.state.topRatedMovies;
                break;
        }
        movies[index].hasLoadedImage = true;
        switch (movieList) {
            case UpComing:
                this.setState({ upComingMovies: movies })
                break;
            case Popular:
                this.setState({ popularMovies: movies })
                break;
            case TopRated:
                this.setState({ topRatedMovies: movies })
                break;
        }

    }

    renderMoviesSkeleton = () => {
        return (
            <View style={styles.moviesSkeletonContainer}>
                <ShimmerPlaceHolder
                    style={styles.movieImageSkeletonPlaceholder}
                    autoRun
                    visible={this.state.visible}
                />
                <ShimmerPlaceHolder
                    style={styles.movieImageSkeletonPlaceholder}
                    autoRun
                    visible={this.state.visible}
                />
            </View>

        )
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#EDEEF2' }}>
                <StatusBar
                    backgroundColor="#EDEEF2"
                    barStyle="dark-content"
                />

                <SafeAreaView style={{ flex: 1, backgroundColor: '#EDEEF2' }}>
                    <ScrollView style={{ flex: 1 }}>
                        <Text style={styles.moviesListOption}>Upcoming</Text>
                        <View style={styles.moviesContainer}>
                            {this.state.loading && this.state.upComingPaginationPage == 1 ?
                                (
                                    this.renderMoviesSkeleton()
                                )
                                :
                                (
                                    <FlatList
                                        horizontal
                                        nestedScrollEnabled
                                        data={this.state.upComingMovies}
                                        keyExtractor={movie => movie.id}
                                        renderItem={({ item, index }) => this.renderMovieBanner(item, index, UpComing)}
                                        onEndReached={() => {
                                            if (!this.loading) {
                                                this.setState({ loading: true }, () => {
                                                    this.loadUpcomingMovies()
                                                })
                                            }
                                        }}
                                    />
                                )
                            }
                        </View>

                        <Text style={styles.moviesListOption}>Popular</Text>
                        <View style={styles.moviesContainer}>
                            {this.state.loading && this.state.upComingPaginationPage == 1 ?
                                (
                                    this.renderMoviesSkeleton()
                                )
                                :
                                (
                                    <FlatList
                                        horizontal
                                        nestedScrollEnabled
                                        data={this.state.popularMovies}
                                        keyExtractor={movie => movie.id}
                                        renderItem={({ item, index }) => this.renderMovieBanner(item, index, Popular)}
                                        onEndReached={() => {
                                            if (!this.loading) {
                                                this.setState({ loading: true }, () => {
                                                    this.loadPopularMovies()
                                                })
                                            }
                                        }}
                                    />
                                )
                            }
                        </View>

                        <Text style={styles.moviesListOption}>TopRated</Text>
                        <View style={styles.moviesContainer}>
                            {this.state.loading && this.state.upComingPaginationPage == 1 ?
                                (
                                    this.renderMoviesSkeleton()
                                )
                                :
                                (
                                    <FlatList
                                        horizontal
                                        nestedScrollEnabled
                                        data={this.state.topRatedMovies}
                                        keyExtractor={movie => movie.id}
                                        renderItem={({ item, index }) => this.renderMovieBanner(item, index, TopRated)}
                                        onEndReached={() => {
                                            if (!this.loading) {
                                                this.setState({ loading: true }, () => {
                                                    this.loadTopratedMovies()
                                                })
                                            }
                                        }}
                                    />
                                )
                            }
                        </View>


                    </ScrollView>
                </SafeAreaView>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    movieBannerGradient: {
        width: movieBannerWidth,
        height: movieBannerHeight / 2,
        position: 'absolute',
        left: 0,
        bottom: 0,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10
    },
    movieTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        color: 'white',
        maxWidth: movieBannerWidth - 16,
        marginLeft: 8,
        marginBottom: 8
    },
    movieItemContainer: {
        width: movieBannerWidth + 16,
        height: movieBannerHeight + 32,
        paddingTop: 32
    },
    headerContainer: {
        width: width,
        height: 80,
        backgroundColor: '#EDEEF2'
    },
    headerFixedStyle: {
        position: 'absolute',
        left: 0,
        top: getStatusBarHeight() - 5,
        backgroundColor: '#EDEEF2',
    },
    header: {
        paddingTop: height * 0.025 + getStatusBarHeight(),
        backgroundColor: '#EDEEF2',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,

        elevation: 4,

    },
    moviesListOptionActive: {
        color: '#202126',
    },
    moviesListOptionInactive: {
        color: '#C5C5C5',
    },
    moviesListOption: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 22,
        marginTop: 20,
        backgroundColor: '#EDEEF2',
    },
    discoverText: {
        color: 'black',
        fontSize: 24,
        marginLeft: width * 0.05,
        fontWeight: 'bold',
    },
    moviesListOptions: {
        flexDirection: 'row',
        paddingLeft: width * 0.05,
        paddingTop: 16,
        paddingBottom: 16,
        width: width,
    },
    movieListContainer: {
        flex: 1,
        width: width,
        justifyContent: 'space-between',
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: width * 0.05
    },
    moviesContainer: {
        flex: 1,
        width: width,
        flexDirection: 'row'
    },
    movieImage: {
        width: movieBannerWidth,
        height: movieBannerHeight,
        marginLeft: 10,
        justifyContent: 'flex-end'
    },
    movieImageSkeletonPlaceholder: {
        width: movieBannerWidth,
        height: movieBannerHeight,
        borderRadius: 10,
        marginLeft: 16
    },
    moviesSkeletonContainer: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: "space-between",
        paddingTop: 32,
        marginLeft: 32
    },
    slide2: {
        flex: 1,
        width: width,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#97CAE5'
    },
    slide3: {
        flex: 1,
        width: width,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#92BBD9'
    },
    text: {
        color: 'black',
        fontSize: 30,
        fontWeight: 'bold'
    }
})
