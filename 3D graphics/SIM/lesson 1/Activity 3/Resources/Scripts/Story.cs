using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Story
{

    public string MainText;
    public string ImageSource;
    public string OptionAText;
    public string OptionBText;
    public Story OptionAStory;
    public Story OptionBStory;
    public bool Ending;

    //Constructor - used by Story object
    public Story(string MainText, string ImageSource, string OptionAText, string OptionBText)
    {
        this.MainText = MainText;
        this.ImageSource = ImageSource;
        this.OptionAText = OptionAText;
        this.OptionBText = OptionBText;
        Ending = false;
    }

    //Constructor - used by Ending Story object
    public Story(string MainText, string ImageSource)
    {
        this.MainText = MainText;
        this.ImageSource = ImageSource;
        this.OptionAText = "";
        this.OptionBText = "";
        Ending = true;
    }

}