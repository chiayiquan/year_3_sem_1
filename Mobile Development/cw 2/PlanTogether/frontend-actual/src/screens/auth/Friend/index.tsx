import React, { useEffect, useState, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hook";
import * as TaskRedux from "../../../redux/Task";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import {
  Agenda,
  DateData,
  AgendaSchedule,
  AgendaEntry,
} from "react-native-calendars";
import { Card } from "@rneui/base";
import moment from "moment";

export default function Calendar() {}
