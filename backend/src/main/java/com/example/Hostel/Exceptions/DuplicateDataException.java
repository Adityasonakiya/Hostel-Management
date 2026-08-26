package com.example.Hostel.Exceptions;

public class DuplicateDataException extends RuntimeException{
    public DuplicateDataException(String msg){
        super(msg);
    }
}
