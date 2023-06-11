import { NavigationProp } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Button, Image, Alert, StyleSheet, ScrollView, TextStyle, ViewStyle, Animated, Dimensions } from 'react-native';
import { ParamList, Question, QuestionItem, getResposesKeys } from './questionnaire';
import { AppButton, OppButton } from '../components/buttons';
import SelectDropdown from 'react-native-select-dropdown'
import axios from 'axios';

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

interface quizAnswer {
  question: {
  subject: string;
  };
  response: string;
  value: number | string;
}
interface answers {
  elderlyNum: string; 
  date: Date;
  personalDetails : personalDetails;
}
interface personalDetails {
  gender : string | number;
    city: string | number;
    birthYear: number | string;
    familyStatus:  string | number;
    economicState: string | number;
    longTermIllness: string | number;
    disability: string | number;
}


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

  const handleEndOfQuiz = (quizAnswers: quizAnswer[] , elderlyNum: string) => {
    const personalDetails : personalDetails = {  gender :"",
      city: "",
      birthYear: 0,
      familyStatus:  "",
      economicState: "",
      longTermIllness: "",
      disability: "" }
    for (let a of quizAnswers) {
      if(a.question.subject === "Gender")
      {
        personalDetails.gender = a.value
      }
      else if(a.question.subject === "City"){
        const selectedCity = cities.find(city => city.he === a.value)
        personalDetails.city = selectedCity ? selectedCity.en : ""      
      }
      else if(a.question.subject === "BirthYear"){
        personalDetails.birthYear = a.value
      }
      else if(a.question.subject === "FamilyStatus"){
        personalDetails.familyStatus = a.value
      }
      else if(a.question.subject === "EconomicState"){
        personalDetails.economicState = a.value
      }
      else if(a.question.subject === "LongTermIllness"){
        personalDetails.longTermIllness = a.value
      }
      else if(a.question.subject === "Disability"){
        personalDetails.disability = a.value
      }
    }
    const quizDate = new Date()
    quizDate.setHours(0, 0, 0, 0)
    const answers : answers = {
      elderlyNum: elderlyNum,
      date: quizDate,
      personalDetails: personalDetails
    }
    console.log("ANSWERS -", answers)
    axios.post('https://elderyresearch.cs.bgu.ac.il/elderly/updateElderly', { answers: answers })
    .then(response => {
      console.log('Response of elderly answers:', response.data);
      if (response.data.success === true) {
        console.log("In if cond")
        navigation.navigate("AfterQuestionnaire", {elderlyNum : elderlyNum});
      }
    })
    .catch(error => {
      console.error(error);
    });
  
  }
  const cities = [
    { en: "Or Yehuda", he: "אור יהודה" },
    { en: "Eilat", he: "אילת" },
    { en: "Ashdod", he: "אשדוד" },
    { en: "Ashkelon", he: "אשקלון" },
    { en: "Be'er Ya'akov", he: "באר יעקב" },
    { en: "Beer Sheva", he: "באר שבע" },
    { en: "Beit Shemesh", he: "בית שמש" },
    { en: "Bnei Brak", he: "בני ברק" },
    { en: "Bat Yam", he: "בת ים" },
    { en: "Givatayim", he: "גבעתיים" },
    { en: "Givat Shmuel", he: "גבעת שמואל" },
    { en: "Dimona", he: "דימונה" },
    { en: "Herzliya", he: "הרצליה" },
    { en: "Hadera", he: "חדרה" },
    { en: "Holon", he: "חולון" },
    { en: "Haifa", he: "חיפה" },
    { en: "Tiberias", he: "טבריה" },
    { en: "Yavne", he: "יבנה" },
    { en: "Yehud-Monosson", he: "יהוד-מונסון" },
    { en: "Jerusalem", he: "ירושלים" },
    { en: "Yokneam Illit", he: "יקנעם עילית" },
    { en: "Kfar Saba", he: "כפר סבא" },
    { en: "Karmiel", he: "כרמיאל" },
    { en: "Lod", he: "לוד" },
    { en: "Modi'in-Maccabim-Re'ut", he: "מודיעין-מכבים-רעות" },
    { en: "Ma'ale Adumim", he: "מעלה אדומים" },
    { en: "Nahariya", he: "נהריה" },
    { en: "Nes Ziona", he: "נס ציונה" },
    { en: "Nazareth", he: "נצרת" },
    { en: "Netanya", he: "נתניה" },
    { en: "Acre", he: "עכו" },
    { en: "Arad", he: "ערד" },
    { en: "Petah Tikva", he: "פתח תקווה" },
    { en: "Tzfat", he: "צפת" },
    { en: "Kiryat Ono", he: "קריית אונו" },
    { en: "Kiryat Ata", he: "קריית אתא" },
    { en: "Kiryat Bialik", he: "קריית ביאליק" },
    { en: "Kiryat Gat", he: "קריית גת" },
    { en: "Kiryat Yam", he: "קריית ים" },
    { en: "Kiryat Motzkin", he: "קריית מוצקין" },
    { en: "Kiryat Malakhi", he: "קריית מלאכי" },
    { en: "Kiryat Shmona", he: "קריית שמונה" },
    { en: "Rosh HaAyin", he: "ראש העין" },
    { en: "Rishon LeZion", he: "ראשון לציון" },
    { en: "Rehovot", he: "רחובות" },
    { en: "Ramat HaSharon", he: "רמת השרון" },
    { en: "Ramat Gan", he: "רמת גן" },
    { en: "Ra'anana", he: "רעננה" },
    { en: "Sderot", he: "שדרות" },
    { en: "Shefar'am", he: "שפרעם" },
    { en: "Tel Aviv", he: "תל אביב" },
  ]
  const years = [];
  for (let year = 1923; year <= 1973; year++) {
    years.push(year);
  }

  const data = [
    {
      question: { text: "מגדר" ,subject: 'Gender', type: 'oneChoice' },
      optionA: { text: "זכר", value: 'male', imagePath: require('../assets/icons/male.png') },
      optionB: { text: "נקבה", value: 'female', imagePath: require('../assets/icons/female.png') },
      optionC: {text: "אחר", value: 'other'}
    },
    {
      question: { text: "בחר את עיר מגוריך", subject: 'City', type: 'selectDropDown' },
      options: { array: cities.map(city => city.he) }

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
      optionA: { text: "מעל הממוצע", value: 'above average', imagePath: require('../assets/emojiIcons/veryGood.png') },
      optionB: { text: "דומה לממוצע", value: 'average', imagePath: require('../assets/emojiIcons/middle.png') },
      optionC: { text: "מתחת לממוצע", value: 'below average', imagePath: require('../assets/emojiIcons/veryBad.png') },
    },
    {
      question: { text: "האם אתה סובל מבעיות בריאות ארוכות טווח, מחלה או נכות? לרבות בעיות בריאות הנפש", subject: 'LongTermIllness', type: 'oneChoice' },
      optionA: { text: "כן", value: 'yes' },
      optionB: { text: "לא", value: 'no'},
    },
    {
      question: { text: "בששת החודשים האחרונים, באיזו מידה היית מוגבל בשל בעיות בריאות בפעילויות שאנשים נוהגים לעשות?", subject: 'Disability', type: 'oneChoice' },
      optionA: { text: "מוגבל", value: 'limited', imagePath: require('../assets/emojiIcons/veryBad.png') },
      optionB: { text: "מוגבל אך לא מאוד", value: 'notVeryLimited', imagePath: require('../assets/emojiIcons/middle.png') },
      optionC: { text: "לא מוגבל", value: 'notLimited', imagePath: require('../assets/emojiIcons/veryGood.png') },
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
        handleEndOfQuiz(results, elderlyNum)
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