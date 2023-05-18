import { NavigationProp } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Button, Image, Alert, StyleSheet, ScrollView, TextStyle, ViewStyle, Animated, Dimensions } from 'react-native';
import { ParamList } from './questionnaire';
import RadioGroup from 'react-native-radio-buttons-group';
import { AppButton, OppButton } from '../components/buttons';
const { width } = Dimensions.get("window");



interface StartQuestionnaireProps {
    navigation: NavigationProp<ParamList, 'StartQuestionnaire'>;
}

type Response = {text: string, value: string, imagePath: string};
type QuestionType = {text: string, type: string}
type QuestionResponse = {
  question: QuestionType;
  response: Response;
};
type Question = { [key: string]: Response} & QuestionResponse;
type QuizSingleChoiceProps = {
  containerStyle: ViewStyle;
  questionTitleStyle: TextStyle;
  responseStyle: ViewStyle;
  responseTextStyle: TextStyle;
  selectedResponseStyle: ViewStyle;
  selectedResponseTextStyle: TextStyle;
  nextButtonText: string;
  nextButtonStyle: ViewStyle;
  nextButtonTextStyle: TextStyle;
  endButtonText: string;
  endButtonStyle: ViewStyle;
  endButtonTextStyle: TextStyle;
  prevButtonText: string;
  prevButtonStyle: ViewStyle;
  prevButtonTextStyle: TextStyle;
  buttonsContainerStyle: ViewStyle;
  responseRequired: boolean;
  onEnd: (results: any) => any;
  data: any;
};

const FindVal = (textResponse: string, item: Question) =>
{
  const responsesKeys = getResposesKeys(item);
  const responses = responsesKeys.map((r) => {
    return {text: item[r].text, value: item[r].value}
  })
  const val = responses.find((r) => r.text === textResponse)
  return val;
}
const QuizSingleChoice = ({
  containerStyle,
  questionTitleStyle,
  responseStyle,
  responseTextStyle,
  selectedResponseStyle,
  selectedResponseTextStyle,
  nextButtonText,
  nextButtonStyle,
  nextButtonTextStyle,
  endButtonText,
  endButtonStyle,
  endButtonTextStyle,
  prevButtonText,
  prevButtonStyle,
  prevButtonTextStyle,
  buttonsContainerStyle,
  responseRequired,
  onEnd,
  data,
}: QuizSingleChoiceProps) => {
  const originalData = data;
  const [questions, setQuestions] = React.useState([
    ...originalData,
  ]);

  const [currentIndex, setCurrentIndex] = React.useState(0);
  const animation = React.useRef(new Animated.Value(0)).current;
  const onAnswer = React.useCallback(
    (_: any, response: string) => {
      const newQuestions = [...questions];
      const activeQuestion = newQuestions[currentIndex];
      activeQuestion.response = FindVal(response, activeQuestion);

      newQuestions[currentIndex] = activeQuestion;
      setQuestions(newQuestions);
    },
    [questions, currentIndex]
  );
  const onNext = React.useCallback(() => {
    if (currentIndex === questions.length - 1) {
      handleEnd(questions);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  }, [currentIndex, questions]);
  const onPrev = React.useCallback(() => {
    if (currentIndex === 0) return;
    setCurrentIndex(currentIndex - 1);
  }, [currentIndex]);
  const handleEnd = React.useCallback(
    (questions: Question[]) => {
      let newData = [];
      for (let q of questions) {
        newData.push({
          question: q.question,
          response:  q.response.text,
          value: q.response.value
        });
      }
      onEnd(newData);
      
    },
    [questions]
  );
  React.useEffect(() => {
    Animated.spring(animation, {
      toValue: currentIndex,
      useNativeDriver: true,
    }).start();
  }, [currentIndex]);
  const translateX =
    questions.length > 1
      ? animation.interpolate({
          inputRange: questions.map((_, index) => index),
          outputRange: questions.map((_, index) => -index * width),
        })
      : 0;
  const isLast = currentIndex === questions.length - 1;
  const isFirst = currentIndex === 0;
  let nextDisabled = responseRequired
    ? !!!questions[currentIndex]?.response
    : false;
  return (
    <View
      style={[
        { flex: 1, backgroundColor: "#FFF"},
        containerStyle,
      ]}
    >
      <Animated.View
        style={{
          flexDirection: "row",
          width: questions.length * width,
          transform: [{ translateX }],
        }}
      >
        {questions.map((item, index) => (
          <View key={index} style={{ alignSelf: "center", width: width }}>
            <Question
              responseStyle={responseStyle}
              questionTitleStyle={questionTitleStyle}
              selectedResponseStyle={selectedResponseStyle}
              selectedResponseTextStyle={selectedResponseTextStyle}
              responseTextStyle={responseTextStyle}
              key={index}
              onAnswer={onAnswer}
              {...{ item }}
            />
          </View>
        ))}
      </Animated.View>
      <View
        style={[
          {
            flexDirection: "row",
            alignItems: "center",
            paddingBottom: 15,
            alignSelf: "center",
            width: width - 50,
            justifyContent: "space-between",
          },
          buttonsContainerStyle,
        ]}
      >
        <OppButton
          onPress={() => {
            onPrev();
          }}
          disabled={isFirst}
          testID="prev"
          containerStyle={{
            width: "40%",
            backgroundColor: "#F00",
            ...prevButtonStyle,
          }}
          title={prevButtonText}
          titleStyle={[{ color: "#FFF" }, prevButtonTextStyle]}
        />
        <OppButton
          onPress={() => {
            onNext();
          }}
          testID="next"
          disabled={nextDisabled}
          containerStyle={{
            width: "40%",
            backgroundColor: "#000",
            ...(isLast ? endButtonStyle : nextButtonStyle),
          }}
          title={isLast ? endButtonText : nextButtonText}
          titleStyle={[
            { color: "#FFF" },
            isLast ? endButtonTextStyle : nextButtonTextStyle,
          ]}
        />
      </View>
    </View>
  );
};

export default QuizSingleChoice;

function getResposesKeys(item: Question) {
  return Object.keys(item).filter(
    (key) => !["question", "answer", "response"].includes(key)
  );
}

type QuestionProps = {
  item: Question;
  onAnswer: Function;
  questionTitleStyle: TextStyle;
  responseStyle: ViewStyle;
  responseTextStyle: TextStyle;
  selectedResponseStyle: ViewStyle;
  selectedResponseTextStyle: TextStyle;
};
function Question({
  item,
  onAnswer,
  questionTitleStyle,
  responseStyle,
  responseTextStyle,
  selectedResponseStyle,
  selectedResponseTextStyle,
}: QuestionProps) {
  const responses = getResposesKeys(item);
  return (
    <View style={{ width: '100%', alignItems: "center"}}>
      <View style= {{ width: '90%' , backgroundColor:'#add8e6', borderRadius: 15, marginHorizontal:15, padding:10, marginTop: 15}}>
      <Text
        style={[
          { textAlign: "center", fontWeight: "700", fontSize: 35, marginBottom: 10, marginTop: 10, color:'black'},
          questionTitleStyle,
        ]}
      >
        {item.question.text}
      </Text>
      </View>
      <View style={{ marginTop: 5 ,marginBottom: 15, width: '90%'}}>
        {responses.map((r,i) => {
          let {text, value, imagePath} = item[r];
          const select = item.response?.text === text;
          return (
            <QuestionItem
              key={i}
              text={text}
              imagePath={imagePath}
              value={value}
              responseTextStyle={
                select ? selectedResponseTextStyle : responseTextStyle
              }
              responseStyle={select ? selectedResponseStyle : responseStyle}
              onPress={() => {
                onAnswer(item, text);
              }}
            />
          );
        })}
      </View>
    </View>
  );
}

type QuestionItemProps = {
  text: string;
  imagePath: string;
  value: string;
  onPress: () => any;
  disabled?: boolean;
  responseStyle: ViewStyle;
  responseTextStyle: TextStyle;
};
function QuestionItem({
  text,
  imagePath,
  onPress,
  disabled,
  responseStyle,
  responseTextStyle,
}: QuestionItemProps) {
  return (
    <View style={{ marginVertical: 10 }}>
      <AppButton
        title={text}
        disabled={disabled}
        testID={text}
        containerStyle={{ backgroundColor: "#000", ...responseStyle }}
        width={"100%"}
        onPress={onPress}
        titleStyle={{ textTransform: "capitalize", ...responseTextStyle }}
        backgroundColor={"#000"}
        titleColor={"#FFF"}
        imagePath={imagePath}
      />
    </View>
  );
}


export const StartQuestionnaire: React.FC<StartQuestionnaireProps>  =  ({navigation})  => {
    const data = [
      {
        question:{text: "בחר את מגדרך", type: 'Gender'},
        optionA: {text :"זכר", value: 'male', imagePath: require('../assets/icons/male.png')},
        optionB: {text: "נקבה",value: 'female', imagePath: require('../assets/icons/female.png')},
       },
       {
        question:{text: "מהו מצבך המשפחתי?", type: 'FamilyStatus'},
        optionA: {text :"בקשר זוגי קבוע", value: 'single'},
        optionB: {text: "לא בקשר זוגי קבוע",value: 'relationship'},

       },
       {
        question:{text: "מצב כלכלי - הכנסה ממוצעת למשפחה בישראל היא 15,755. כיצד היית מגדיר את מצבך הכלכלי?", type: 'EconomicState'},
        optionA: {text :"מעל הממוצע", value: 'aboveAvg', imagePath: require('../assets/emojiIcons/veryGood.png')},
        optionB: {text: "דומה לממוצע",value: 'likeAvg', imagePath: require('../assets/emojiIcons/middle.png')},
        optionC: {text: "מתחת לממוצע",value: 'underAvg', imagePath: require('../assets/emojiIcons/veryBad.png')},
       },
       {
        question:{text: "כיצד היית מגדיר את מצב בריאותך?", type: 'Health'},
        optionA: {text :"מצויין", value: 'excelent', imagePath: require('../assets/emojiIcons/veryGood.png')},
        optionB: {text: "טוב מאוד",value: 'veryGood', imagePath: require('../assets/emojiIcons/good.png')},
        optionC: {text: "טוב",value: 'good',imagePath: require('../assets/emojiIcons/middle.png')},
        optionD: {text: "סביר", value: 'bad', imagePath: require('../assets/emojiIcons/bad.png')},
        optionE:{text: "גרוע",value: 'veryBad', imagePath: require('../assets/emojiIcons/veryBad.png')},
       },
    ];
      return (
        <QuizSingleChoice
        containerStyle={{ backgroundColor: "white"}}
        questionTitleStyle={{}}
        responseStyle={{
          borderRadius: 15,
          backgroundColor:'transparent',
          borderColor: 'black',
          borderWidth: 2
        }}
        responseTextStyle={{ fontSize: 30, fontWeight: "bold", color: 'black' }}
        selectedResponseStyle={{
          borderRadius: 15,
          backgroundColor: "#8ccc89",
          borderColor: 'black',
        }}
        selectedResponseTextStyle={{
          fontSize: 32,
          fontWeight: "bold",
          color:'black'
        }}
        responseRequired={true}
        nextButtonText={"הבא"}
        nextButtonStyle={{ backgroundColor: "#06d755" }}
        nextButtonTextStyle={{ color: "#FFF", fontSize: 20 }}
        prevButtonText={"הקודם"}
        prevButtonStyle={{ backgroundColor: "#fa5541" }}
        prevButtonTextStyle={{ color: "#FFF", fontSize: 20 }}
        endButtonText={"סיים"}
        endButtonStyle={{ backgroundColor: "#000" }}
        endButtonTextStyle={{ color: "#FFF", fontSize: 20 }}
        buttonsContainerStyle={{ marginTop: "auto", }}
        onEnd={(results) => {
          console.log(results);
          navigation.navigate("AfterQuestionnaire")
        }}
        data={data}
      />)
  }

