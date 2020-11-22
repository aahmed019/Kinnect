import React, {Component} from 'react'
import {Dimensions, Image, StyleSheet, Text, View,ScrollView,Platform,SafeAreaView, Button, TouchableOpacity} from 'react-native'
import {DragSortableView, AutoDragSortableView} from 'react-native-drag-sort'


import img0 from "../../images/hangman0.jpg"
import img1 from "../../images/hangman1.jpg"
import img2 from "../../images/hangman2.jpg"
import img3 from "../../images/hangman3.jpg"
import img4 from "../../images/hangman4.jpg"
import img5 from "../../images/hangman5.jpg"
import img6 from "../../images/hangman6.jpg"

const images = [
    { "icon": img0, "txt":'1'},
    { "icon": img1, "txt":'2'},
    { "icon": img2, "txt":'3'},
    { "icon": img3, "txt":'4'},
    { "icon": img0, "txt":'5'},
    { "icon": img1, "txt":'6'},
    { "icon": img2, "txt":'7'},
    { "icon": img3, "txt":'8'},
    { "icon": img3, "txt":'9'},
    { "icon": img3, "txt":'10'},
    { "icon": img3, "txt":'11'},
    { "icon": img3, "txt":'12'},
    
]

const {width} = Dimensions.get('window')

const parentWidth = width
const childrenWidth = width/3 - 20
const childrenHeight = 48*4
const headerViewHeight = 160
const bottomViewHeight = 40

export default class DragNDrop extends Component {

    constructor(props) {
        super()

        this.state = { 
            data: images,
            answer: [2,1,3,4],
            test: false,
            newAnswer: [0,0,0,0]
        }
        
    }

    checkAnswer(d){
        console.log(d[0].icon + '<=======================')
        for (var i = 0; i<this.state.answer.length; i++){
            if(d[i].icon !== this.state.answer[i]){
                return alert('Wrong Answer')
            }
        }

        return alert("You got it")

    }
    
    render() {
        // Write a temporary example

        const renderHeaderView = (

            <View style={styles.aheader}>
                <View>
                    <Text style={styles.aheader_title}>Ordering</Text>
                    <Text style={styles.aheader_desc}>This is going to be about ordering, all you have to do is 
                        order the following panels in the correct order, below you have a check answer
                        button which can help you determine if your answer is correct or not.</Text>
                </View>
            </View>
        )

        return (
            <SafeAreaView style={{flex: 1, backgroundColor: '#2b2d40'}}>
                
                <AutoDragSortableView
                    dataSource={this.state.data}
                    parentWidth={parentWidth}
                    childrenWidth= {childrenWidth}
                    marginChildrenBottom={10}
                    marginChildrenRight={10}
                    marginChildrenLeft = {10}
                    marginChildrenTop = {10}
                    childrenHeight={childrenHeight}

                    onDataChange = {(data)=>{
                        if (data.length != this.state.data.length) {
                            this.setState({
                                data: data,
                            })
                        }
                        this.setState({
                            newAnswer: data
                        })
                    }}
                   // keyExtractor={(item,index)=> item.txt} // FlatList
                    renderItem={(item,index)=>{
                        
                        return this.renderItem(item,index)
                    }}
                    renderHeaderView = {renderHeaderView}
                    headerViewHeight={headerViewHeight}
                    bottomViewHeight={bottomViewHeight}
                />
                <TouchableOpacity style ={{alignItems: "center",backgroundColor: "skyblue",
                padding: 10}} onPress = {() =>{this.checkAnswer(this.state.newAnswer)}}>
                    <Text style={styles.buttonItem}>Check Answer</Text>
                </TouchableOpacity>
            </SafeAreaView>
        )
    }

    renderItem(item,index) {
        return (
            <View style={styles.item}>
                <View style={styles.item_icon_swipe}>
                    <Image style={styles.item_icon} source={item.icon}/>
                </View>
        <Text></Text>
                <View style={styles.item_text_swipe}>
                    <Text style={styles.item_text}>{item.txt}</Text>
                </View>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    header_title: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold'
    },
    item: {
        width: childrenWidth,
        height: childrenHeight,
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: 'skyblue',
        borderRadius: 50,
    },
    buttonItem: {
        fontFamily: 'AppleSDGothicNeo-UltraLight',
        fontSize: 30,
        color: 'white',
        fontWeight: '300',
        textAlign: 'center',
        justifyContent: 'space-between'
    },
    item_icon_swipe: {
        width: childrenWidth*0.7,
        height: childrenWidth*0.7,
        backgroundColor: '#fff',
        borderRadius: childrenWidth*0.35,
        justifyContent: 'center',
        alignItems: 'center',
    },
    item_icon: {
        width: childrenWidth*0.5,
        height: childrenWidth*0.5,
        resizeMode: 'contain',
    },
    item_text_swipe: {
        backgroundColor: '#fff',
        width: 56,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    item_text: {
        color: '#444',
        fontSize: 20,
        fontWeight: 'bold',
    },
    aheader: {
        height: headerViewHeight,
        flexDirection: 'row',
        backgroundColor: '#2b2d40'
    },
    aheader_title: {
        textAlign:'center',
        color: 'white',
        fontSize: 20,
        marginBottom: 10,
        fontWeight: 'bold'
    },
    aheader_desc: {
        color: 'white',
        fontSize: 16,
        textAlign: "center"
    },
})