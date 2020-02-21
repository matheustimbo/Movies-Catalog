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
    FlatList
} from 'react-native';
import { getStatusBarHeight } from 'react-native-iphone-x-helper'
import LinearGradient from 'react-native-linear-gradient';
import { CollapsibleHeaderScrollView } from 'react-native-collapsible-header-views';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';

const API_KEY = 'ab7e70767dfe42f8f72cd8b9e592a44c'
const IMAGE_REQUEST = 'https://image.tmdb.org/t/p/w500'
const UpComing = 'Upcoming'
const Popular = 'Popular'
const TopRated = 'TopRated'

const { width, height } = Dimensions.get("window")

export default class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            moviesListOption: UpComing,
            upComingMovies: [],
            upComingPaginationPage: 1,
            paginatedScrollLoading: false,
            loading: false
        };
    }

    onEnableScroll = (value) => {
        this.setState({
            enableScrollViewScroll: value,
        });
    };

    isCloseToBottom({layoutMeasurement, contentOffset, contentSize}){
        return layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
    }

    UNSAFE_componentWillMount = () => {
        if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
    }

    componentDidMount = () => {
        this.loadMovies()
    }

    loadMovies = () => {
        const { upComingMovies, upComingPaginationPage } = this.state;
        this.setState({ loading: true })
        fetch(`https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}&language=pt-BR&&include_image_language=pt-BR&page=${upComingPaginationPage}`)
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    upComingMovies: upComingPaginationPage == 1 ? 
                    responseJson.results : 
                    [...upComingMovies, ...responseJson.results], 
                },()=>{
                    this.setState({
                        upComingPaginationPage: upComingPaginationPage+1,
                        loading: false
                    })
                })
                
            })
            .catch((error) => {
                console.error(error);
            });
    }

    renderHeader = () => {
        return (
            <View style={styles.headerContainer}>
                <Text style={styles.discoverText}>DISCOVER</Text>
                <View style={[styles.moviesListOptions]}>
                    <TouchableOpacity
                        onPress={() => {
                            this.setState({ moviesListOption: UpComing })
                            this.horizontalScroll.scrollTo({ x: 0, y: 0, animated: true })
                        }}
                    >
                        <Text style={[styles.moviesListOption, this.state.moviesListOption == UpComing ? styles.moviesListOptionActive : styles.moviesListOptionInactive]}>Upcoming</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            this.setState({ moviesListOption: Popular })
                            this.horizontalScroll.scrollTo({ x: width, y: 0, animated: true })
                        }}
                    >
                        <Text style={[styles.moviesListOption, this.state.moviesListOption == Popular ? styles.moviesListOptionActive : styles.moviesListOptionInactive]}>Popular</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            this.setState({ moviesListOption: TopRated })
                            this.horizontalScroll.scrollTo({ x: width * 2, y: 0, animated: true })
                        }}
                    >
                        <Text style={[styles.moviesListOption, this.state.moviesListOption == TopRated ? styles.moviesListOptionActive : styles.moviesListOptionInactive]}>Top Rated</Text>
                    </TouchableOpacity>
                </View>
                <LinearGradient
                    style={{ width: width, height: 5, position: 'absolute', left: 0, bottom: -5 }}
                    colors={['rgba(0,0,0,0.12)', 'transparent']}
                />
            </View>
        )
    }

    renderMovieBanner = movie => {
        return (
            <TouchableOpacity>
                <Image
                    style={styles.movieImage}
                    source={{ uri: IMAGE_REQUEST + movie.poster_path }}
                />
            </TouchableOpacity>
        )
    }

    renderMoviesSkeleton = () => {
        return(
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
                />

                <SafeAreaView style={{ flex: 1, backgroundColor: '#EDEEF2' }}>

                    <CollapsibleHeaderScrollView
                        CollapsibleHeaderComponent={this.renderHeader()}
                        headerHeight={80}
                        scrollEventThrottle={16}
                        nestedScrollEnabled
                        scrollEnabled={this.state.enableScrollViewScroll}
                        statusBarHeight={-50}
                        ref={(ref) => {
                            this.verticalScroll = ref
                        }}
                        onScroll={({nativeEvent})=>{
                            if(this.isCloseToBottom(nativeEvent) && !this.loading){
                               this.setState({loading: true},()=>{
                                   this.loadMovies()
                               })
                            }
                        }}
                        
                        style={{ height: height - getStatusBarHeight(), width: width }}>
                        <ScrollView
                            horizontal
                            pagingEnabled
                            showsHorizontalScrollIndicator={false}
                            nestedScrollEnabled
                            ref={(ref) => {
                                this.horizontalScroll = ref
                            }}
                        >
                            <View style={styles.moviesContainer}>
                                <View style={styles.movieListContainer}>
                                    {this.state.loading && this.state.upComingPaginationPage == 1 ?
                                        (
                                            this.renderMoviesSkeleton()
                                        )
                                        :
                                        (
                                            <FlatList
                                                scrollEnabled={false}
                                                nestedScrollEnabled
                                                data={this.state.upComingMovies}
                                                keyExtractor={movie => movie.id}
                                                renderItem={({ item }) => this.renderMovieBanner(item)}
                                                numColumns={2}
                                            />
                                        )
                                    }
                                    
                                </View>
                                {this.state.loading && this.state.upComingPaginationPage != 1 && 
                                    (
                                        <View style={{marginVertical: 20}}>
                                            <ActivityIndicator size="large" color="#C5C5C5" />
                                        </View>
                                    )
                                }
                                
                            </View>
                            
                            <View style={styles.slide2}>
                                <Text style={styles.text}>Beautiful</Text>
                            </View>
                            <View style={styles.slide3}>
                                <Text style={styles.text}>And simple</Text>
                            </View>
                        </ScrollView>
                    </CollapsibleHeaderScrollView>

                </SafeAreaView>

            </View>
        );
    }
}

const styles = StyleSheet.create({
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
        fontSize: 14,
        fontWeight: 'bold',
        marginRight: 14,
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
        width: width
    },
    movieImage: {
        width: width / 2 - width * 0.05 - 8,
        height: (width / 2 - 16) * 1.6,
        marginTop: 16,
        marginRight: 16,
        borderRadius: 10
    },
    movieImageSkeletonPlaceholder: {
        width: width / 2 - width * 0.05 - 8,
        height: (width / 2 - 16) * 1.6,
        borderRadius: 10,
        marginTop: 16,
    },
    moviesSkeletonContainer: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: "space-between"
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
