# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
import json, os
from datetime import datetime
import pytz
from django.conf import settings
from django.shortcuts import render
from venue_reg.models import Accounts,Admins, Managements,Records,Venues,Managements

tz = pytz.timezone('Asia/Taipei')
# Create your views here.

class Login(APIView):
    def get(self, request):
        _acc = request.GET.get("acc", None)
        _passwd = request.GET.get("passwd", None)
        print(_acc)
        try:
            unit = vars(Admins.objects.get(acc=_acc, passwd=_passwd))
            unit.pop("_state", None)
            unit["is_admin"] = True
        except:
            try:
                unit = vars(Accounts.objects.get(acc=_acc, passwd=_passwd))
                unit.pop("_state", None)
                unit["is_admin"] = False
            except:
                unit = {}
                print("Find No Account.")
        return Response(unit)

class GetVenues(APIView):
    def get(self, request):
        venues = []
        units = list(Venues.objects.all())
        print(units)
        for u in units:
            unit = vars(u)
            unit.pop("_state", None)
            venues.append(unit)
        return Response(venues)

class GetMyRecords(APIView):
    def get(self, request):
        _acc = request.GET.get("acc", None)
        units = list(Records.objects.filter(acc=_acc,cancelornot=False))
        rlt = []
        for u in units:
            unit = vars(u)
            unit.pop("_state", None)
            unit["courtname"] = vars(Venues.objects.get(venueid=unit["venueid"]))["location"]
            rlt.append(unit)
        print(len(rlt))
        return Response(rlt)

class GetDayRecords(APIView):
    def get(self, request):
        _date = request.GET.get("date", None)
        units = list(Records.objects.filter(rdate=_date,cancelornot=False))
        rlt = []
        for u in units:
            unit = vars(u)
            unit.pop("_state", None)
            unit["courtname"] = vars(Venues.objects.get(venueid=unit["venueid"]))["location"]
            try:
                unit["username"] = vars(Accounts.objects.get(acc=unit["acc"]))["teamname"]
            except:
                try:
                    Admins.objects.get(acc=unit["acc"])
                    unit["username"] = "管理員"
                except:
                    unit["username"] = unit["acc"]
            rlt.append(unit)
        print(len(rlt))
        return Response(rlt)

class InsertRecord(APIView):
    def post(self, request):
        print(request.data)
        data = request.data
        unit = Records.objects.create(acc=data["acc"],venueid=data["venueID"],rdate=data["rdate"],\
        starttime=data["starttime"],endtime=data["endtime"],phone=data["phone"],line=data["line"],\
        contactperson=data["contactperson"],cancelornot=False,coordinateornot=data["coordinatable"])
        unit.save()
        unit = vars(unit)
        try:
            Admins.objects.get(acc=data["acc"])
            print("Is Admin. Add Managements.")
            print(datetime.now(tz))
            m_unit = Managements.objects.create(acc=unit["acc"], recordid=unit["recordid"], registertime=datetime.now(tz))
            m_unit.save()
            print(Managements.objects.all())
        except:
            print("Is Account. Do nothing.")
        #print(Records.objects.all())
        return Response(request.data, status=status.HTTP_201_CREATED)

class HoursAWeek(APIView):
    def get(self, request):
        _from = request.GET.get("from", None)
        _to = request.GET.get("to", None)
        _acc = request.GET.get("acc", None)
        units = list(Records.objects.filter(acc=_acc, cancelornot=False, rdate__range=[_from, _to]))
        hours = 0
        for u in units:
            unit = vars(u)
            hours += (unit["endtime"] - unit["starttime"])
        return Response(hours)

class LazyDelete(APIView):
    def get(self, request):
        _id = request.GET.get("id", None)
        print("Delete",_id)
        unit = Records.objects.get(recordid=_id)
        unit.cancelornot = True
        unit.save()
        unit = vars(unit)
        try:
            Admins.objects.get(acc=unit["acc"])
            print("Is Admin. Add Managements.")
            m_unit = Managements.objects.create(acc=unit["acc"], recordid=unit["recordid"], deletetime=datetime.now(tz))
            m_unit.save()
            print(Managements.objects.all())
        except:
            print("Is Account. Do nothing.")
        return Response("Success")

def index(request):
    return render(request, 'index.html')