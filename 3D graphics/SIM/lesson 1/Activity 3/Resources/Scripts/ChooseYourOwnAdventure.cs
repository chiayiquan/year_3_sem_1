using UnityEngine;
using UnityEngine.UI;

public class ChooseYourOwnAdventure : MonoBehaviour
{

    [SerializeField] Text StoryText;
    [SerializeField] Image StoryImage;
    [SerializeField] Text OptionAText;
    [SerializeField] Text OptionBText;
    [SerializeField] Button OptionAButton;
    [SerializeField] Button OptionBButton;

    public Story EntryStory;
    public Story CurrentStory;

    // Use this for initialization
    void Start()
    {
        //Init the Story Structure
        EntryStory = new Story("Story 1", "S1", "Option 1a", "Option 1b");
        Story Story2 = new Story("Story 2", "S2", "Option 2a", "Option 2b");
        Story Story3 = new Story("Story 3", "S3", "Option 3a", "Option 3b");
        Story Story4 = new Story("Story 4", "S4", "Option 4a", "Option 4b");
        Story Ending1 = new Story("Ending 1", "E1");
        Story Ending2 = new Story("Ending 2", "E2");
        Story Ending3 = new Story("Ending 3", "E3");

        //Chain up the story
        EntryStory.OptionAStory = Story2;
        EntryStory.OptionBStory = Story3;

        Story2.OptionAStory = Ending1;
        Story2.OptionBStory = Story4;
        Story4.OptionAStory = Ending2;
        Story4.OptionBStory = Story3;
        Story3.OptionAStory = Ending2;

        Story3.OptionBStory = Ending3;

        //Starting Story
        CurrentStory = EntryStory;
        SetCurrentStory();
    }

    void SetCurrentStory()
    {
        StoryText.text = CurrentStory.MainText;
        Sprite image = Resources.Load<Sprite>(CurrentStory.ImageSource);
        StoryImage.sprite = image;
        OptionAText.text = CurrentStory.OptionAText;
        OptionBText.text = CurrentStory.OptionAText;
    }

    public void OptionAClicked()
    {
        CurrentStory = CurrentStory.OptionAStory;
        SetCurrentStory();
        if (CurrentStory.Ending)
        {
            DisableOptionButton();
        }
    }

    public void OptionBClicked()
    {
        CurrentStory = CurrentStory.OptionBStory;
        SetCurrentStory();
        if (CurrentStory.Ending)
        {
            DisableOptionButton();
        }
    }

    void DisableOptionButton()
    {
        OptionAButton.gameObject.SetActive(false);
        OptionBButton.gameObject.SetActive(false);
    }
}