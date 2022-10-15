import React, { useEffect, useState, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hook";
import * as TaskRedux from "../../../redux/Task";
import { StyleSheet, Text, View, TouchableOpacity, Modal } from "react-native";
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
import { Ionicons } from "@expo/vector-icons";
import { Task } from "redux-saga";

export default function Calendar() {
  const dispatch = useAppDispatch();
  const rangeMonth = 3;
  const user = useAppSelector((state) => state.user);
  const tasks = useAppSelector((state) => state.task);
  const [agendaItems, setAgendaItems] = useState<AgendaSchedule>({});
  const [dateRange, setDateRange] = useState<number[]>([]);
  const [dateToRender, setDateToRender] = useState<string>(
    moment().format("YYYY-MM-DD")
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] =
    useState<TaskModel.StateDataEntry | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");

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
    if (JSON.stringify(prevTaskState) !== JSON.stringify(tasks.task)) {
      const schedules: AgendaSchedule = generateDays(dateToRender, rangeMonth);

      Object.keys(tasks.task).forEach((key) => {
        // to prevent error if the generateDays did not generate this key
        if (!schedules[key]) schedules[key] = [];
        tasks.task[key].forEach((task) => {
          schedules[key].push({
            name: JSON.stringify(task),
            height: 30,
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
        schedule[DateLib.addDaysToDate(currentDate, index)] = [];
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
      setDateToRender(date.dateString);
    }
  }

  function renderItem(item: AgendaEntry) {
    const tasks = TaskModel.decodeStateDataEntry(JSON.parse(item.name));
    // console.log(task);
    if ("code" in tasks) {
      return <View>{tasks.message}</View>;
    }

    const { task, participants } = tasks;
    return (
      <TouchableOpacity
        onPress={() => {
          setSelectedDate(item.day);
          setSelectedTask(tasks);
          setModalVisible(true);
        }}
      >
        <Card>
          <View>
            <Text style={styles.taskTitle}>{task.name}</Text>
            <Text>
              Duration: {task.timeStart} - {task.timeEnd}
            </Text>
            <Text>Description: {task.description}</Text>
            <Text>Participants: {participants.length}</Text>
          </View>
        </Card>
      </TouchableOpacity>
    );
  }

  function MoreInfoModal({
    taskObj,
    date,
  }: {
    taskObj: TaskModel.StateDataEntry | null;
    date: string;
  }) {
    if (taskObj == null) {
      return null;
    }
    const { task, participants } = taskObj;

    return (
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 20,
            marginBottom: 20,
            paddingHorizontal: 10,
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 20 }}>
            {date} ({task.timeStart} to {task.timeEnd})
          </Text>
          <TouchableOpacity>
            <Ionicons
              name="close"
              size={24}
              color="black"
              onPress={() => setModalVisible(false)}
            />
          </TouchableOpacity>
        </View>

        <View style={{ paddingHorizontal: 10, paddingTop: "2%" }}>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>Task</Text>
          <Text style={{ fontSize: 16 }}>{task.name}</Text>

          <Text style={{ fontSize: 18, fontWeight: "bold" }}>Description</Text>
          <Text style={{ fontSize: 16 }}>{task.description}</Text>

          <Text style={{ fontSize: 18, fontWeight: "bold", paddingTop: "1%" }}>
            Location:
          </Text>
          <Text style={{ fontSize: 16 }}>{task.location}</Text>

          <Text style={{ fontSize: 18, fontWeight: "bold", paddingTop: "1%" }}>
            Participants:
          </Text>
          {participants.map(({ user, status }) => {
            return (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ fontSize: 16 }}>
                  {user.name}({user.handler})
                </Text>

                <Text style={{ fontSize: 16 }}>{status}</Text>
              </View>
            );
          })}

          <View>
            <TouchableOpacity>
              <Text>Complete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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

      <MoreInfoModal taskObj={selectedTask} date={selectedDate} />
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
  taskTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  taskBody: {},
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
