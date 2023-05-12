import React from "react";
import {
  Animated,
  Dimensions,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import {  NavigationProp } from '@react-navigation/native';
import { AppButton, OppButton } from "../components/buttons"
const { width } = Dimensions.get("window");

type Response = {text: string, value: number, imagePath: string};
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
      <View style= {{ width: '90%' , backgroundColor:'#add8e6', borderRadius: 15, marginHorizontal:15, padding:10, marginTop: 20}}>
      <Text
        style={[
          { textAlign: "center", fontWeight: "700", fontSize: 35, marginBottom: 15, marginTop: 10, color:'black'},
          questionTitleStyle,
        ]}
      >
        {item.question.text}
      </Text>
      </View>
      {/* <View style={{borderBottomColor: 'black', borderBottomWidth: 5, width: '100%'}}/> */}
      <View style={{ marginVertical: 15 , width: '90%'}}>
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
  value: number;
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
export type ParamList = {
    LoginScreen: undefined;
    HomeMenuView: undefined;
    Questionnaire: undefined;
    AfterQuestionnaire: undefined;
  }
  interface QuestionnaireProps {
    navigation: NavigationProp<ParamList, 'Questionnaire'>;
  }

export const Questionnaire: React.FC<QuestionnaireProps> =  ({navigation})  => {
    const data = [
      {
        question:{text: "כיצד היית מגדיר את מצבך הבריאותי ?", type: 'Physical Condition'},
        optionA: {text :"מצויין", value: 5, imagePath: require('../assets/emojiIcons/veryGood.png')},
        optionB: {text: "טוב מאוד",value: 4, imagePath: require('../assets/emojiIcons/good.png')},
        optionC: {text: "טוב",value: 3, imagePath: require('../assets/emojiIcons/middle.png')},
        optionD: {text: "סביר", value: 2, imagePath: require('../assets/emojiIcons/bad.png')},
        optionE:{text: "רע", value: 1, imagePath: require('../assets/emojiIcons/veryBad.png')},
       },
       {
        question:{text: "באיזה תדירות אתה מרגיש בודד ?", type: 'Loneliness'},
        optionA: {text :"לעיתים קרובות", value: 4, imagePath: require('../assets/emojiIcons/veryBad.png')},
        optionB: {text: "לפעמים",value: 3, imagePath: require('../assets/emojiIcons/bad.png')},
        optionC: {text: "לעיתים רחוקות",value: 2, imagePath: require('../assets/emojiIcons/middle.png')},
        optionD: {text: "אף פעם לא", value: 1, imagePath: require('../assets/emojiIcons/veryGood.png')},
       },
       {
        question:{text: "איך היית מדרג את איכות השינה שלך", type: 'Sleeping'},
        optionA: {text :"מצויינת", value: 5, imagePath: require('../assets/emojiIcons/veryGood.png')},
        optionB: {text: "טובה מאוד",value: 4, imagePath: require('../assets/emojiIcons/good.png')},
        optionC: {text: "טובה",value: 3,imagePath: require('../assets/emojiIcons/middle.png')},
        optionD: {text: "סבירה", value: 2, imagePath: require('../assets/emojiIcons/bad.png')},
        optionE:{text: "גרועה",value: 1, imagePath: require('../assets/emojiIcons/veryBad.png')},
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
        buttonsContainerStyle={{ marginTop: "auto" }}
        onEnd={(results) => {
          console.log(results);
          navigation.navigate("AfterQuestionnaire")
        }}
        data={data}
      />)
  }

 export const AfterQuestionnaire = () =>
{
  return(
  <View style={{width: '100%', height:'100%', position:'absolute', backgroundColor: '#add8e6', flex:1, alignItems: 'center'}}>
  <Text style={{backgroundColor: '#add8e6', fontSize: 50, color:'black', alignSelf: 'center'}}>תודה שענית על השאלון! </Text>
</View>)
}