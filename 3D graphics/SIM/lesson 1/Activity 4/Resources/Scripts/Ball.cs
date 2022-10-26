using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class Ball : MonoBehaviour
{
    public float speed = 0.05f;
    int leftPlayerScore = 0;
    int rightPlayerScore = 0;
    [SerializeField] Text leftPlayerScoreText;
    [SerializeField] Text rightPlayerScoreText;


    // Start is called before the first frame update
    void Start()
    {
        GetComponent<Rigidbody2D>().velocity = Vector2.right * speed;
    }

    void OnCollisionEnter2D(Collision2D c)
    {
        float hitPos = hitPosition(transform.position, c.transform.position, c.collider.bounds.size.y);


        if (c.gameObject.name == "RacketLeft")
        {
            Vector2 direction = new Vector2(1, hitPos).normalized;
            GetComponent<Rigidbody2D>().velocity = direction * speed;

        }
        else if (c.gameObject.name == "RacketRight")
        {
            Vector2 direction = new Vector2(-1, hitPos).normalized;
            GetComponent<Rigidbody2D>().velocity = direction * speed;
        }
        else if (c.gameObject.name == "VWallRight")
        {
            //Give 1 score to the left player
            leftPlayerScore++;
            leftPlayerScoreText.text = leftPlayerScore + "";
            print("Left Player Score:" + leftPlayerScore);
            float r = Random.Range(-1.0f, 1.0f);
            //x is -1 and y is a random number between -1.0 and 1.0
            Vector2 direction = new Vector2(-1, r).normalized;
            GetComponent<Rigidbody2D>().velocity = direction * speed;
        }
        else if (c.gameObject.name == "VWallLeft")
        {
            //give 1 score to the right player
            rightPlayerScore++;
            rightPlayerScoreText.text = rightPlayerScore + "";
            print("Right Player Score:" + rightPlayerScore);

            float r = Random.Range(-1.0f, 1.0f);
            //x is 1 and y is a random number between -1.0 and 1.0
            Vector2 direction = new Vector2(1, r).normalized;
            GetComponent<Rigidbody2D>().velocity = direction * speed;

        }
        else if (c.gameObject.name == "HWallTop")
        {
            float r = Random.Range(-1.0f, 1.0f);
            //x is a random number between -1.0 and 1.0. y is -1
            Vector2 direction = new Vector2(r, -1).normalized;
            GetComponent<Rigidbody2D>().velocity = direction * speed;

        }
        else if (c.gameObject.name == "HWallBottom")
        {
            float r = Random.Range(-1.0f, 1.0f);
            //x is a random number between -1.0 and 1.0. y is 1
            Vector2 direction = new Vector2(r, 1).normalized;
            GetComponent<Rigidbody2D>().velocity = direction * speed;
        }

    }

    float hitPosition(Vector2 ballPosition, Vector2 racketPosition, float racketHeight)
    {
        return (ballPosition.y - racketPosition.y) / racketHeight;
    }
}
