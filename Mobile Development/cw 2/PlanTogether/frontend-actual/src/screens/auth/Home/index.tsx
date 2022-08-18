import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hook";
import * as TaskRedux from "../../../redux/Task";
import {
  StyleSheet,
  Text,
  View,
  Button,
  EventEmitter,
  TouchableOpacity,
} from "react-native";
// import * as Google from "expo-google-app-auth";
import * as Google from "expo-auth-session/providers/google";
import { Prompt, TokenResponse } from "expo-auth-session";
import {
  Agenda,
  DateData,
  AgendaSchedule,
  AgendaEntry,
} from "react-native-calendars";
import { Card } from "@rneui/base";
import DateLib from "../../../utils/date";
import * as TaskModel from "../../../models/Task";
import moment from "moment";

function timeToString(time: number): string {
  const date = new Date(time);
  return date.toISOString().split("T")[0];
}

export default function Home() {
  const dispatch = useAppDispatch();
  const rangeMonth = 3;
  const user = useAppSelector((state) => state.user);
  const tasks = useAppSelector((state) => state.task);
  const [agendaItems, setAgendaItems] = useState<AgendaSchedule>({});
  const [dateRange, setDateRange] = useState<number[]>([]);

  // const [user, setUser] = useState<TokenResponse>();
  // const [code, setCode] = useState<string | null>(null);
  // const [request, response, promptAsync] = Google.useAuthRequest({
  //   expoClientId:
  //     "522599487334-e2a4rgv029bqhelhjou9uc6oq5tvsp1m.apps.googleusercontent.com",
  //   iosClientId:
  //     "522599487334-59i8hohktqk2gd87lo1ejlo6ovjd7sb2.apps.googleusercontent.com",
  //   androidClientId:
  //     "522599487334-9717m9cb0lbtoi43hj77qtu3vogtk68p.apps.googleusercontent.com",
  //   // webClientId:
  //   //   "522599487334-mvk1efm1lg79rm32k10n6fqatuhmucfq.apps.googleusercontent.com",
  //   scopes: [
  //     "openid",
  //     "https://www.googleapis.com/auth/calendar",
  //     "https://www.googleapis.com/auth/calendar.events",
  //     "https://www.googleapis.com/auth/userinfo.email",
  //     "https://www.googleapis.com/auth/userinfo.profile",
  //   ],
  //   responseType: "code",
  //   shouldAutoExchangeCode: false,
  //   extraParams: {
  //     access_type: "offline",
  //   },
  //   prompt: Prompt.Consent,
  // });

  useEffect(() => {
    if (user.user) {
      const date = DateLib.createDateRange(rangeMonth);
      dispatch(
        TaskRedux.sagaActions.getTaskList({
          jwt: user.user.jwt,
          dateRange: date,
        })
      );
      setDateRange(date);
    }
  }, []);

  function usePrevious(value: any) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  }
  const prevTaskState = usePrevious(tasks.task);
  useEffect(() => {
    if (prevTaskState !== tasks.task) {
      const schedules: AgendaSchedule = generateDays(
        moment().format("YYYY-MM-DD"),
        rangeMonth
      );
      console.log(schedules);
      Object.keys(tasks.task).forEach((key) => {
        tasks.task[key].forEach((task) => {
          schedules[key].push({
            name: JSON.stringify(task),
            height: 20,
            day: key,
          });
        });
      });
      setAgendaItems(schedules);
    }
  }, [tasks.task, prevTaskState]);

  // generate x number of month before and after of a given month
  function generateDays(date: string, range: number): AgendaSchedule {
    const schedule: AgendaSchedule = {};

    // get the first month to start from by minusing range away from given date
    const startDate = DateLib.getFirstDayOfMonthDate(date, range, "subtract");

    // x number of months before and after of given date
    // e.g. 18-July-2022 passed in for date and range is 3 should generate from 1-Apr-2022 to 31 Oct 2022
    const numberOfIteration = range * 2 + 1;
    [...new Array(numberOfIteration).keys()].forEach((index) => {
      const currentDate = DateLib.getLastDayOfMonthDate(
        startDate,
        index,
        "add"
      );
      const numberOfDays: number = DateLib.getLastDayOfMonth(currentDate);
      [...new Array(numberOfDays).keys()].forEach((index) => {
        schedule[
          `${moment(currentDate).add(index, "days").format("YYYY-MM-DD")}`
        ] = [];
      });
    });

    return schedule;
  }
  // useEffect(() => {
  //   if (response?.type === "success") {
  //     const { authentication, params } = response;
  //     setCode(params.code);
  //     console.log(response);
  //     if (authentication) {
  //       setUser(authentication);
  //       (async () => {
  //         const getUserReq = await fetch(
  //           "https://www.googleapis.com/oauth2/v2/userinfo",
  //           {
  //             headers: {
  //               Authorization: `Bearer ${authentication.accessToken}`,
  //             },
  //           }
  //         );
  //         console.log(await getUserReq.json());
  //       })();
  //     }
  //   }
  // }, [response]);

  // async function getCalendarList() {
  //   try {
  //     // if (code != null) {
  //     //   try {
  //     //     const tokenResult = await refreshAsync(
  //     //       {
  //     //         clientId:
  //     //           "522599487334-e2a4rgv029bqhelhjou9uc6oq5tvsp1m.apps.googleusercontent.com",
  //     //         refreshToken: code,
  //     //       },
  //     //       {
  //     //         tokenEndpoint: "www.googleapis.com/oauth2/v4/token",
  //     //       }
  //     //     );
  //     //     console.log(tokenResult);
  //     //   } catch (error) {
  //     //     console.log(error);
  //     //   }
  //     // }
  //     console.log(code);
  //     const data = await fetch("https://accounts.google.com/o/oauth2/token", {
  //       method: "POST",
  //       headers: {
  //         Accept: "application/json",
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         code: code,
  //         client_id:
  //           "522599487334-e2a4rgv029bqhelhjou9uc6oq5tvsp1m.apps.googleusercontent.com",
  //         client_secret: "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",
  //         redirect_uri: "https://auth.expo.io/@xieyiquan/frontend-actual",
  //         grant_type: "authorization_code",
  //         code_challenge_method: "S256",

  //         scopes: [
  //           "openid",
  //           "https://www.googleapis.com/auth/calendar",
  //           "https://www.googleapis.com/auth/calendar.events",
  //           "https://www.googleapis.com/auth/userinfo.email",
  //           "https://www.googleapis.com/auth/userinfo.profile",
  //         ],
  //       }),
  //     });
  //     // const data = await fetch(
  //     //   `https://accounts.google.com/o/oauth2/token?grant_type=authorization_code&code=${code}&client_id=522599487334-e2a4rgv029bqhelhjou9uc6oq5tvsp1m.apps.googleusercontent.com&client_secret=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&redirect_uri=https://auth.expo.io/@xieyiquan/frontend-actual`,
  //     //   {
  //     //     method: "POST",
  //     //     headers: {
  //     //       Accept: "application/json",
  //     //       "Content-Type": "application/json",
  //     //     },
  //     //     // body: JSON.stringify({
  //     //     //   code: code,
  //     //     //   client_id:
  //     //     //     "522599487334-e2a4rgv029bqhelhjou9uc6oq5tvsp1m.apps.googleusercontent.com",
  //     //     //   client_secret: "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",
  //     //     //   redirect_uri: "https://auth.expo.io/@xieyiquan/frontend-actual",
  //     //     //   grant_type: "authorization_code",
  //     //     // }),
  //     //   }
  //     // );
  //     console.log(await data.json());
  //   } catch (error) {
  //     console.log(error);
  //   }

  //   if (user != null) {
  //     try {
  //       let calendarsList = await fetch(
  //         "https://www.googleapis.com/calendar/v3/users/me/calendarList",
  //         {
  //           headers: {
  //             Authorization: `Bearer ${user.accessToken}`,
  //             Accept: "application/json",
  //           },
  //         }
  //       );
  //       console.log(calendarsList);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  // }

  function loadItems(date: DateData) {
    if (user.user == null) return;
    console.log(date.dateString);
    // have to have a 1 month buffer as the library scrolling would lag by 1 month
    const renderFirstDayUnix = DateLib.convertDateToUnix(
      DateLib.getFirstDayOfMonthDate(date.dateString, 1)
    );
    const renderLastDayUnix = DateLib.convertDateToUnix(
      DateLib.getLastDayOfMonthDate(date.dateString, 1)
    );
    if (renderFirstDayUnix < dateRange[0] || renderLastDayUnix > dateRange[1]) {
      console.log("fetching....");
      const firstDayToFetch = DateLib.convertDateToUnix(
        DateLib.getFirstDayOfMonthDate(date.dateString, rangeMonth, "subtract")
      );
      const secondDayToFetch = DateLib.convertDateToUnix(
        DateLib.getLastDayOfMonthDate(date.dateString, rangeMonth, "add")
      );
      dispatch(
        TaskRedux.sagaActions.getTaskList({
          jwt: user.user.jwt,
          dateRange: [firstDayToFetch, secondDayToFetch],
        })
      );
      setDateRange([firstDayToFetch, secondDayToFetch]);
    }
    // setTimeout(() => {
    //   for (let i = -15; i < 10; i++) {
    //     const time = day.timestamp + i * 24 * 60 * 60 * 1000;
    //     const strTime = timeToString(time);
    //     if (!items[strTime]) {
    //       items[strTime] = [];
    //       const numItems = Math.floor(Math.random() * 3 + 1);
    //       for (let j = 0; j < numItems; j++) {
    //         items[strTime].push({
    //           name: "Item for " + strTime + " #" + j,
    //           height: Math.max(50, Math.floor(Math.random() * 150)),
    //           day: strTime,
    //         });
    //       }
    //     }
    //   }
    //   const newItems: AgendaSchedule = {};
    //   Object.keys(items).forEach((key) => {
    //     newItems[key] = items[key];
    //   });
    //   setItems(newItems);
    // }, 1000);
  }

  function renderItem(item: AgendaEntry) {
    const task = TaskModel.decodeStateDataEntry(JSON.parse(item.name));
    // console.log(task);
    if ("code" in task) {
      return <View>{task.message}</View>;
    }
    return (
      <TouchableOpacity>
        <Card>
          <View>
            <Text>{task.task.name}</Text>
          </View>
        </Card>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <Agenda
        items={agendaItems}
        loadItemsForMonth={(month) => loadItems(month)}
        selected={DateLib.getCurrentDate()}
        renderItem={renderItem}
        // renderItem={this.renderItem}
        // renderEmptyDate={this.renderEmptyDate}
        // rowHasChanged={this.rowHasChanged}
        hideKnob={false}
        showClosingKnob={true}
        renderEmptyDate={() => {
          return (
            <View>
              <Text>Nothing today</Text>
            </View>
          );
        }}
        // renderEmptyData={() => {
        //   return (
        //     <View>
        //       <Text>Nothing today</Text>
        //     </View>
        //   );
        // }}
        pastScrollRange={100}
        futureScrollRange={100}

        // markingType={"multi-dot"}
        // markedDates={{
        //   "2022-05-08": { textColor: "#43515c" },
        //   "2022-05-09": { textColor: "#43515c" },
        //   "2022-05-14": { startingDay: true, endingDay: true, color: "blue" },
        //   "2022-05-21": { startingDay: true, color: "blue" },
        //   "2022-05-22": { endingDay: true, color: "gray" },
        //   "2022-05-24": { startingDay: true, color: "gray" },
        //   "2022-05-25": { color: "gray" },
        //   "2022-05-26": { endingDay: true, color: "gray" },
        // }}
        // monthFormat={'yyyy'}
        // theme={{calendarBackground: 'red', agendaKnobColor: 'green'}}
        //renderDay={(day, item) => (<Text>{day ? day.day: 'item'}</Text>)}
        // hideExtraDays={false}
        // showOnlySelectedDayItems
        // reservationsKeyExtractor={this.reservationsKeyExtractor}
      />
      {/* <Button disabled={!request} title="Login" onPress={() => promptAsync()} />
      <Button title="Get List" onPress={() => getCalendarList()} />
      <StatusBar style="auto" /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#fff",
    // alignItems: "center",
    // justifyContent: "center",
  },
});
