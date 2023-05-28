import { NavigationProp } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Button, Image, Alert, StyleSheet, ScrollView, TextStyle, ViewStyle, Animated, Dimensions } from 'react-native';
import { ParamList, Question, QuestionItem, getResposesKeys } from './questionnaire';
import { AppButton, OppButton } from '../components/buttons';
import SelectDropdown from 'react-native-select-dropdown'

const { width } = Dimensions.get("window");

const FindVal = (textResponse: string, item: Question) =>
{
  if (item.question.type === "oneChoice") {
  const responsesKeys = getResposesKeys(item);
  const responses = responsesKeys.map((r) => {
    return {text: item[r].text, value: item[r].value}
  })
  const val = responses.find((r) => r.text === textResponse)
  return val;
}
if(item.question.type === "selectDropDown") {
  const val = { text: textResponse, value: textResponse}
  return val;
}
}


interface StartQuestionnaireProps {
  navigation: NavigationProp<ParamList, 'StartQuestionnaire'>;
}

type Response = { text: string, value: number | string, imagePath: string };
type QuestionType = { text: string, subject: string, type: string }
type QuestionResponse = {
  question: QuestionType;
  response: Response;
};
type Question = { [key: string]: Response } & QuestionResponse;

export function SelectQuestion({
  item,
  onAnswer,
}: any) {
const {options} = item

  return (
    <View style={{ width: '100%', alignItems: "center"}}>
      <View style={{ width: '90%', backgroundColor: '#add8e6', borderRadius: 15, marginHorizontal: 15, padding: 10, marginTop: 15}}>
        <Text
          style={[
            { textAlign: "center", fontWeight: "700", fontSize: 35, marginBottom: 10, marginTop: 10, color: 'black' },
          ]}
        >
          {item.question.text}
        </Text>
      </View>
      <View style={{ marginTop: 15, marginBottom: 15, width: '90%' }}>
          <SelectDropdown
            data={options.array}
            onSelect={(selectedItem, index) => {
              item.response = selectedItem;
              onAnswer(item, selectedItem);
              console.log(selectedItem, index);
            }}
            defaultButtonText={"בחר מהרשימה"}
            buttonTextAfterSelection={(selectedItem, index) => {
              return selectedItem;
            }}
            rowTextForSelection={(item, index) => {
              return item;
            }}
            buttonStyle={styles.dropdown1BtnStyle}
            buttonTextStyle={styles.dropdown1BtnTxtStyle}
            renderDropdownIcon={(isOpened) => {
              return <Image source={isOpened ? require('../assets/icons/chevron-up.png') : require('../assets/icons/chevron-down.png')}/>}}
            dropdownIconPosition={'left'}
            dropdownStyle={styles.dropdown1DropdownStyle}
            rowStyle={styles.dropdown1RowStyle}
            rowTextStyle={styles.dropdown1RowTxtStyle}
          />
      </View>
    </View>
  );
}


type QuizProps = {
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

const Quiz = ({
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
}: QuizProps) => {
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
          response: q.response.text,
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
        { flex: 1, backgroundColor: "#FFF" },
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
          <View key={index} style={{width: width }}>
            {item.question.type === 'oneChoice' &&
              <Question
                responseStyle={responseStyle}
                questionTitleStyle={questionTitleStyle}
                selectedResponseStyle={selectedResponseStyle}
                selectedResponseTextStyle={selectedResponseTextStyle}
                responseTextStyle={responseTextStyle}
                key={index}
                onAnswer={onAnswer}
                {...{ item }}
              />}
            {item.question.type === "selectDropDown" &&
              <SelectQuestion item={item} onAnswer={onAnswer} />}
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
export default Quiz;

export const StartQuestionnaire: React.FC<StartQuestionnaireProps> = ({ navigation , route }) => {
  const elderlyNum = route.params?.elderlyNum;

  const cities = [
    "ירושלים",
    "תל אביב",
    "חיפה",
    "ראשון לציון",
    "פתח תקווה",
    "אשדוד",
    "נתניה",
    "באר שבע",
    "חולון",
    "בני ברק",
    "רמת גן",
    "אשקלון",
    "רחובות",
    "בת ים",
    "הרצליה",
    "כפר סבא",
    "רעננה",
    "לוד",
    "נהריה",
    "מודיעין-מכבים-רעות",
    "חדרה",
    "בית שמש",
    "לוד",
    "נצרת",
    "רמת השרון",
    "דימונה",
    "צפת",
    "עכו",
    "אילת",
    "טבריה",
    "גבעתיים"]
  const years = [];
  for (let year = 1923; year <= 1973; year++) {
    years.push(year);
  }

  const data = [
    {
      question: { text: "בחר את מגדרך", subject: 'Gender', type: 'oneChoice' },
      optionA: { text: "זכר", value: 'male', imagePath: require('../assets/icons/male.png') },
      optionB: { text: "נקבה", value: 'female', imagePath: require('../assets/icons/female.png') },
    },
    {
      question: { text: "בחר את עיר מגוריך", subject: 'City', type: 'selectDropDown' },
      options: {array :cities}

    },
    {
      question: { text: "בחר את שנת הלידה שלך", subject: 'BirthYear', type: 'selectDropDown' },
      options: {array: years}

    },
    {
      question: { text: "מהו מצבך המשפחתי?", subject: 'FamilyStatus', type: 'oneChoice' },
      optionA: { text: "בקשר זוגי קבוע", value: 'single' },
      optionB: { text: "לא בקשר זוגי קבוע", value: 'relationship' },

    },
    {
      question: { text: "מצב כלכלי - הכנסה ממוצעת למשפחה בישראל היא 15,755. כיצד היית מגדיר את מצבך הכלכלי?", subject: 'EconomicState', type: 'oneChoice' },
      optionA: { text: "מעל הממוצע", value: 'aboveAvg', imagePath: require('../assets/emojiIcons/veryGood.png') },
      optionB: { text: "דומה לממוצע", value: 'likeAvg', imagePath: require('../assets/emojiIcons/middle.png') },
      optionC: { text: "מתחת לממוצע", value: 'underAvg', imagePath: require('../assets/emojiIcons/veryBad.png') },
    },
    {
      question: { text: "כיצד היית מגדיר את מצב בריאותך?", subject: 'Health', type: 'oneChoice' },
      optionA: { text: "מצויין", value: 'excelent', imagePath: require('../assets/emojiIcons/veryGood.png') },
      optionB: { text: "טוב מאוד", value: 'veryGood', imagePath: require('../assets/emojiIcons/good.png') },
      optionC: { text: "טוב", value: 'good', imagePath: require('../assets/emojiIcons/middle.png') },
      optionD: { text: "סביר", value: 'bad', imagePath: require('../assets/emojiIcons/bad.png') },
      optionE: { text: "גרוע", value: 'veryBad', imagePath: require('../assets/emojiIcons/veryBad.png') },
    },
    {
      question: { text: "כיצד היית מגדיר את מצב בריאותך?", subject: 'Health', type: 'oneChoice' },
      optionA: { text: "מצויין", value: 'excelent', imagePath: require('../assets/emojiIcons/veryGood.png') },
      optionB: { text: "טוב מאוד", value: 'veryGood', imagePath: require('../assets/emojiIcons/good.png') },
      optionC: { text: "טוב", value: 'good', imagePath: require('../assets/emojiIcons/middle.png') },
      optionD: { text: "סביר", value: 'bad', imagePath: require('../assets/emojiIcons/bad.png') },
      optionE: { text: "גרוע", value: 'veryBad', imagePath: require('../assets/emojiIcons/veryBad.png') },
    },
  ];


  return (
    <Quiz
      containerStyle={{ backgroundColor: "white" }}
      questionTitleStyle={{}}
      responseStyle={{
        borderRadius: 15,
        backgroundColor: 'transparent',
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
        color: 'black'
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
        navigation.navigate("AfterQuestionnaire", {elderlyNum : elderlyNum});
      }}
      data={data}
    />)
}

const styles = StyleSheet.create({

  dropdown1BtnStyle: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#444',
    alignSelf: 'center'
  },
  dropdown1BtnTxtStyle: {color: 'black', textAlign: 'center', fontSize: 25},
  dropdown1DropdownStyle: {backgroundColor: '#EFEFEF', borderRadius: 8},
  dropdown1RowStyle: {backgroundColor: '#EFEFEF', borderBottomColor: '#C5C5C5'},
  dropdown1RowTxtStyle: {color: 'black', textAlign: 'center', fontSize: 25},
});